import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    Flex,
    Box,
    Text,
    useColorModeValue,
    Image,
    Spinner,
  } from '@chakra-ui/react';
  import { useState, useEffect } from 'react';
  import axios from 'axios';
  
  const PaymentModal = ({ isOpen, onClose, id }) => {
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const [qrData, setQrData] = useState({ qrCodeUrl: '', referenceCode: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    const fetchQrCode = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication failed: No token found!');
        }
  
        const response = await axios.get(`http://localhost:9090/api/qrcode/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setQrData({
          qrCodeUrl: response.data.qrCodeUrl || '',
          referenceCode: response.data.referenceCode || '',
        });
        setError('');
      } catch (err) {
        console.error('Error fetching QR code:', err);
        setError('Failed to load QR code. Please try again.');
        setQrData({ qrCodeUrl: '', referenceCode: '' });
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      if (!isOpen || !id) return;
      fetchQrCode();
    }, [isOpen, id]);
  
    const handleDownload = () => {
      const link = document.createElement('a');
      link.href = qrData.qrCodeUrl;
      link.download = `payment-qr-${qrData.referenceCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="lg" fontWeight="700" color={textColor}>
              Payment QR Code
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" align="center" gap="20px">
              {error ? (
                <Text fontSize="sm" fontWeight="500" color="red.500">
                  {error}
                </Text>
              ) : (
                <>
                  {isLoading ? (
                    <Spinner
                      size="xl"
                      color={textColor}
                      thickness="4px"
                      speed="0.65s"
                    />
                  ) : qrData.qrCodeUrl ? (
                    <Box>
                      <Image
                        src={qrData.qrCodeUrl}
                        alt="Payment QR Code"
                        boxSize="200px"
                        objectFit="contain"
                        borderRadius="10px"
                      />
                    </Box>
                  ) : (
                    <Text fontSize="sm" fontWeight="500" color={textColor}>
                      No QR code available
                    </Text>
                  )}
                  {qrData.referenceCode && (
                    <Box textAlign="center">
                      <Text
                        fontSize="sm"
                        fontWeight="700"
                        color={textColor}
                        mb="8px"
                      >
                        Reference Code: {qrData.referenceCode}
                      </Text>
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        maxW="400px"
                      >
                        Scan the QR code above with your banking app to make the payment. Please include the reference code in your transaction for verification.
                      </Text>
                    </Box>
                  )}
                </>
              )}
            </Flex>
          </ModalBody>
          <ModalFooter>
            {qrData.qrCodeUrl && (
              <>
                <Button
                  variant="darkBrand"
                  color="white"
                  fontSize="sm"
                  fontWeight="500"
                  borderRadius="10px"
                  px="15px"
                  py="5px"
                  onClick={fetchQrCode}
                  isLoading={isLoading}
                  mr="8px"
                >
                  Regenerate QR Code
                </Button>
                <Button
                  variant="darkBrand"
                  color="white"
                  fontSize="sm"
                  fontWeight="500"
                  borderRadius="10px"
                  px="15px"
                  py="5px"
                  onClick={handleDownload}
                  isDisabled={isLoading || !qrData.qrCodeUrl}
                  mr="8px"
                >
                  Download QR Code
                </Button>
              </>
            )}
            <Button
              variant="whiteBrand"
              color="dark"
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              px="15px"
              py="5px"
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default PaymentModal;