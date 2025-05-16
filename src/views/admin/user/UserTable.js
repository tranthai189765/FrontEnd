import {
    Flex,
    Box,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Icon,
    Tr,
    Input,
    useColorModeValue,
    Button,
    useDisclosure,
    Checkbox,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Spinner,
  } from '@chakra-ui/react';
  import * as React from 'react';
  import { useToast } from '@chakra-ui/react';
  import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
  } from '@tanstack/react-table';
  import axios from 'axios';
  // Custom components
  import Card from 'components/card/Card';
  import Menu from 'components/menu/TableMenu';
  import { IconButton } from '@chakra-ui/react';
  import { MdCancel, MdCheckCircle } from 'react-icons/md';
  import UserModal from './UserModal';
  import UserFilterModal from './FilterModal';
  import columnsIcon from './IconButton';
  
  const columnHelper = createColumnHelper();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  
  const activateAccount = async (globalId, toast) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Authentication failed: No token found!');
        return;
      }
  
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/users/activate/${globalId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
  
      if (response.status === 200) {
        toast({
          title: 'Account activated!',
          description: `Account with ID: ${globalId} has been successfully activated.`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error activating account:', error);
      toast({
        title: 'Activation failed!',
        description: 'An error occurred while activating the account.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };
  
  const deactivateAccount = async (globalId, toast) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Authentication failed: No token found!');
        return;
      }
  
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/users/deactivate/${globalId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
  
      if (response.status === 200) {
        toast({
          title: 'Account deactivated!',
          description: `Account with ID: ${globalId} has been successfully deactivated.`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deactivating account:', error);
      toast({
        title: 'Deactivation failed!',
        description: 'An error occurred while deactivating the account.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };
  
  const batchActivateAccounts = async (ids, toast, refreshData, tableData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Authentication failed: No token found!');
        return false;
      }
  
      const filteredIds = ids.filter(id => {
        const user = tableData.find(user => user.id === id);
        return user && user.name !== 'admin';
      });
  
      if (filteredIds.length === 0) {
        toast({
          title: 'No valid users selected!',
          description: 'Cannot activate admin account.',
          status: 'warning',
          duration: 2000,
          isClosable: true,
        });
        return false;
      }
  
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/users/batch/activate`,
        { ids: filteredIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
  
      if (response.status === 200) {
        toast({
          title: 'Accounts activated!',
          description: `${filteredIds.length} accounts have been successfully activated.`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        refreshData();
        return true;
      }
    } catch (error) {
      console.error('Error batch activating accounts:', error);
      toast({
        title: 'Batch activation failed!',
        description: 'An error occurred while activating the accounts.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return false;
    }
  };
  
  const batchDeleteAccounts = async (ids, toast, refreshData, tableData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Authentication failed: No token found!');
        return false;
      }
  
      const filteredIds = ids.filter(id => {
        const user = tableData.find(user => user.id === id);
        return user && user.name !== 'admin';
      });
  
      if (filteredIds.length === 0) {
        toast({
          title: 'No valid users selected!',
          description: 'Cannot delete admin account.',
          status: 'warning',
          duration: 2000,
          isClosable: true,
        });
        return false;
      }
  
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/users/batch/delete`,
        { ids: filteredIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
  
      if (response.status === 200) {
        toast({
          title: 'Accounts deleted!',
          description: `${filteredIds.length} accounts have been successfully deleted.`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        refreshData();
        return true;
      }
    } catch (error) {
      console.error('Error batch deleting accounts:', error);
      toast({
        title: 'Batch deletion failed!',
        description: 'An error occurred while deleting the accounts.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return false;
    }
  };
  
  const batchNotifyAccounts = async (ids, toast) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Authentication failed: No token found!');
        return false;
      }
  
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/users/batch/notify`,
        { ids },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
  
      if (response.status === 200) {
        toast({
          title: 'Notifications sent!',
          description: `${ids.length} users have been successfully notified.`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        return true;
      }
    } catch (error) {
      console.error('Error sending batch notifications:', error);
      toast({
        title: 'Batch notification failed!',
        description: 'An error occurred while sending notifications.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return false;
    }
  };
  
  const exportToExcel = async (toast) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Authentication failed: No token found!');
        return;
      }
  
      const response = await axios.get(`${API_BASE_URL}/api/export/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      toast({
        title: 'Export successful!',
        description: 'Users have been exported to Excel.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast({
        title: 'Export failed!',
        description: 'An error occurred while exporting to Excel.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };
  
  const toggleStatus = (id, accessor, setOriginalData, setData, tableData, toast) => {
    const user = tableData.find(user => user.id === id);
    if (user && user.name === 'admin') {
      toast({
        title: 'Action blocked!',
        description: 'Cannot modify admin account status.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
  
    setOriginalData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [accessor]: !item[accessor] } : item,
      ),
    );
  
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [accessor]: !item[accessor] } : item,
      ),
    );
  };
  
  const generateColumns = (
    columnsConfig,
    textColor,
    setData,
    setOriginalData,
    toggleStatus,
    toast,
    handleEdit,
    handleView,
    formData,
    selectedRows,
    setSelectedRows,
    tableData,
  ) => {
    return [
      columnHelper.display({
        id: 'select',
        header: () => (
          <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            Select
          </Text>
        ),
        cell: ({ row }) => {
          const isAdmin = row.original.name === 'admin';
          // Defensive check to ensure selectedRows is an array
          const safeSelectedRows = Array.isArray(selectedRows) ? selectedRows : [];
          return (
            <Checkbox
              isChecked={safeSelectedRows.includes(row.original.id)}
              onChange={() => {
                if (isAdmin) {
                  toast({
                    title: 'Selection blocked!',
                    description: 'Cannot select admin account.',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                  });
                  return;
                }
                setSelectedRows((prev) => {
                  // Ensure prev is an array
                  const safePrev = Array.isArray(prev) ? prev : [];
                  return safePrev.includes(row.original.id)
                    ? safePrev.filter((id) => id !== row.original.id)
                    : [...safePrev, row.original.id];
                });
              }}
              isDisabled={isAdmin}
            />
          );
        },
      }),
      ...columnsConfig.map(({ Header, accessor }) =>
        columnHelper.accessor(accessor, {
          id: accessor,
          header: () => (
            <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
              {Header}
            </Text>
          ),
          cell: (info) => {
            const row = info.row.original;
            const cellValue = info.getValue();
            const isAdmin = row.name === 'admin';
  
            if (typeof cellValue === 'boolean') {
              return (
                <Flex
                  align="center"
                  cursor={isAdmin ? 'not-allowed' : 'pointer'}
                  onClick={() => {
                    if (isAdmin) {
                      toast({
                        title: 'Action blocked!',
                        description: 'Cannot modify admin account status.',
                        status: 'warning',
                        duration: 2000,
                        isClosable: true,
                      });
                      return;
                    }
                    if (cellValue) {
                      deactivateAccount(row.id, toast);
                    } else {
                      activateAccount(row.id, toast);
                    }
                    toggleStatus(row.id, accessor, setOriginalData, setData, tableData, toast);
                  }}
                >
                  <IconButton
                    aria-label={cellValue ? 'Activated' : 'Unactivated'}
                    icon={
                      <Icon
                        w="24px"
                        h="24px"
                        me="5px"
                        color={cellValue ? 'green.500' : 'red.500'}
                        as={cellValue ? MdCheckCircle : MdCancel}
                      />
                    }
                    size="sm"
                    variant="ghost"
                    mr="8px"
                    isDisabled={isAdmin}
                  />
                  <Text color={textColor} fontSize="sm" fontWeight="700">
                    {cellValue ? 'Activated' : 'Unactivated'}
                  </Text>
                </Flex>
              );
            }
  
            return (
              <Text color={textColor} fontSize="sm" fontWeight="700">
                {cellValue}
              </Text>
            );
          },
        }),
      ),
      ...columnsIcon({ setData, toast, handleEdit, handleView, formData, tableData }),
    ];
  };
  
  export default function ColumnTable({ tableData, columnsConfig, refreshData }) {
    const [sorting, setSorting] = React.useState([]);
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const toast = useToast();
    const [data, setData] = React.useState([]);
    const [originalData, setOriginalData] = React.useState([]);
    const [error, setError] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [isVisible, setIsVisible] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(true);
    const rowsPerPage = 5;
    const [idEdit, setIdEdit] = React.useState(0);
    const [mode, setMode] = React.useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
    const [newUser, setNewUser] = React.useState({
      name: '',
      password: '',
      role: '',
      fullName: '',
      age: '',
      phone: '',
      email: '',
      status: '',
      apartmentNumbers: '',
    });
    const [selectedRows, setSelectedRows] = React.useState([]);
    const {
      isOpen: isActivateModalOpen,
      onOpen: onActivateModalOpen,
      onClose: onActivateModalClose,
    } = useDisclosure();
    const {
      isOpen: isDeleteModalOpen,
      onOpen: onDeleteModalOpen,
      onClose: onDeleteModalClose,
    } = useDisclosure();
    const {
      isOpen: isNotifyModalOpen,
      onOpen: onNotifyModalOpen,
      onClose: onNotifyModalClose,
    } = useDisclosure();
    const [searchTerm, setSearchTerm] = React.useState('');
  
    // Debounce search term to prevent excessive filtering
    const debounce = (func, wait) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    };
  
    const handleFilterSuccess = (newData) => {
      setOriginalData(newData);
      setData(newData);
      setCurrentPage(1);
      setIsLoading(false);
    };
  
    const submitUserData = async (
      url,
      method,
      formData,
      expectedResponse,
      successTitle,
    ) => {
      setError([]);
      console.log(
        `${method === 'POST' ? 'Saving' : 'Editing'} user:`,
        JSON.stringify(formData),
      );
  
      const token = localStorage.getItem('token');
  
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
  
        const rawData = await response.text();
        console.log('Raw response:', rawData);
  
        if (response.status === 200) {
          toast({
            title: successTitle,
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
          refreshData();
          onClose();
          return true;
        }
  
        let data;
        try {
          data = JSON.parse(rawData);
        } catch (jsonError) {
          data = { message: rawData };
        }
  
        if (!response.ok) {
          const errorMessages =
            data && typeof data === 'object'
              ? Object.values(data)
              : ['Operation failed'];
          setError(errorMessages);
          return false;
        }
        return false;
      } catch (err) {
        console.error('Fetch Error:', err);
        let errorMessage = 'Error in server, please try later.';
        if (
          err.message.includes('Failed to fetch') ||
          err.message.includes('NetworkError')
        ) {
          errorMessage = 'Error in server, please try later.';
        } else {
          errorMessage = err.message;
        }
  
        if (errorMessage.includes(' | ')) {
          setError(errorMessage.split(' | '));
        } else {
          setError([errorMessage]);
        }
        return false;
      }
    };
  
    const handleSubmit = async (formData) => {
      const formattedData = {
        ...formData,
        apartmentNumbers: formData.apartmentNumbers
          ? formData.apartmentNumbers
              .split(',')
              .map((num) => num.trim())
              .filter((num) => num)
          : null,
      };
      console.log('form = ', formattedData);
      if (mode === 'create') {
        return await submitUserData(
          `${API_BASE_URL}/api/admin/users/add`,
          'POST',
          formattedData,
          'User created successfully',
          'Creation Successful!',
        );
      } else if (mode === 'edit') {
        if (formattedData.name === 'admin') {
          toast({
            title: 'Action blocked!',
            description: 'Cannot edit admin account.',
            status: 'warning',
            duration: 2000,
            isClosable: true,
          });
          return false;
        }
        return await submitUserData(
          `${API_BASE_URL}/api/admin/users/edit/${idEdit}`,
          'POST',
          formattedData,
          'User updated successfully',
          'Updating Successful!',
        );
      }
      return false;
    };
  
    const handleView = async (id) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${API_BASE_URL}/api/admin/users/resident-info/${id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const rawData = await response.text();
        console.log('rawData from view = ', rawData);
        let data = JSON.parse(rawData);
        setNewUser({ ...data, status: data.status });
        setMode('view');
        onOpen();
      } catch (error) {
        console.error('Error viewing user:', error);
        toast({
          title: 'Failed!',
          description: 'An error occurred while viewing the user.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    };
  
    const handleEdit = async (id) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${API_BASE_URL}/api/admin/users/edit/${id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const rawData = await response.json();
        console.log('rawData = ', rawData);
        let data = rawData.resident;
        if (data.name === 'admin') {
          toast({
            title: 'Action blocked!',
            description: 'Cannot edit admin account.',
            status: 'warning',
            duration: 2000,
            isClosable: true,
          });
          return;
        }
        setNewUser({ ...data, status: data.status });
        setMode('edit');
        setIdEdit(id);
        onOpen();
      } catch (error) {
        console.error('Error editing user:', error);
        toast({
          title: 'Failed!',
          description: 'An error occurred while editing the user.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    };
  
    // Debounced search handler
    const debouncedSetSearch = React.useCallback(
      debounce((value) => {
        setSearchTerm(value);
        setCurrentPage(1);
      }, 300),
      [],
    );
  
    React.useEffect(() => {
      setIsLoading(true);
      if (Array.isArray(tableData)) {
        setOriginalData(tableData);
        setData(tableData);
        setIsLoading(false);
      } else {
        console.warn('tableData is not an array, skipping update');
        setIsLoading(false);
      }
    }, [tableData]);
  
    const toggleStatusHandler = (id, accessor) =>
      toggleStatus(id, accessor, setOriginalData, setData, tableData, toast);
  
    const handleSelectAll = () => {
      const validRows = data.filter(row => row.name !== 'admin').map(row => row.id);
      setSelectedRows(validRows);
      if (data.some(row => row.name === 'admin')) {
        toast({
          title: 'Selection limited!',
          description: 'Admin account cannot be selected.',
          status: 'warning',
          duration: 2000,
          isClosable: true,
        });
      }
    };
  
    const handleDeselectAll = () => {
      setSelectedRows([]);
    };
  
    const handleBatchActivate = async () => {
      if (selectedRows.length === 0) {
        toast({
          title: 'No users selected!',
          description: 'Please select at least one user to activate.',
          status: 'warning',
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      onActivateModalOpen();
    };
  
    const confirmBatchActivate = async () => {
      const success = await batchActivateAccounts(selectedRows, toast, refreshData, tableData);
      if (success) {
        setSelectedRows([]);
        onActivateModalClose();
      }
    };
  
    const handleBatchDelete = async () => {
      if (selectedRows.length === 0) {
        toast({
          title: 'No users selected!',
          description: 'Please select at least one user to delete.',
          status: 'warning',
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      onDeleteModalOpen();
    };
  
    const confirmBatchDelete = async () => {
      const success = await batchDeleteAccounts(selectedRows, toast, refreshData, tableData);
      if (success) {
        setSelectedRows([]);
        onDeleteModalClose();
      }
    };
  
    const handleBatchNotify = async () => {
      if (selectedRows.length === 0) {
        toast({
          title: 'No users selected!',
          description: 'Please select at least one user to notify.',
          status: 'warning',
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      onNotifyModalOpen();
    };
  
    const confirmBatchNotify = async () => {
      const success = await batchNotifyAccounts(selectedRows, toast);
      if (success) {
        setSelectedRows([]);
        onNotifyModalClose();
      }
    };
  
    const columns = generateColumns(
      columnsConfig,
      textColor,
      setData,
      setOriginalData,
      toggleStatusHandler,
      toast,
      handleEdit,
      handleView,
      newUser,
      selectedRows,
      setSelectedRows,
      tableData,
    );
  
    const filteredData = React.useMemo(() => {
      if (searchTerm.trim() === '') {
        return originalData;
      }
      return originalData.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    }, [searchTerm, originalData]);
  
    const table = useReactTable({
      data: filteredData,
      columns,
      state: { sorting },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });
  
    const totalPages = Math.ceil(table.getRowModel().rows.length / rowsPerPage);
    const paginatedRows = table
      .getRowModel()
      .rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  
    return (
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Flex align="center">
            <Text
              color={textColor}
              fontSize="22px"
              fontWeight="700"
              lineHeight="100%"
              mr="12px"
            >
              User Account Table
            </Text>
          </Flex>
          <Flex align="center">
            <Text
              color={textColor}
              fontSize="17px"
              fontWeight="700"
              lineHeight="100%"
              mr="12px"
            >
              Export to
            </Text>
            <Menu />
          </Flex>
        </Flex>
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Flex align="center" gap="10px">
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              px="15px"
              py="5px"
              onClick={() => {
                onOpen();
                setMode('create');
                setNewUser({
                  name: '',
                  password: '',
                  role: '',
                  fullName: '',
                  age: '',
                  phone: '',
                  email: '',
                  status: '',
                  apartmentNumbers: '',
                });
              }}
            >
              Add a new account
            </Button>
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              px="15px"
              py="5px"
              onClick={onFilterOpen}
            >
              User Filter
            </Button>
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              px="15px"
              py="5px"
              onClick={handleSelectAll}
            >
              Select All
            </Button>
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              px="15px"
              py="5px"
              onClick={handleDeselectAll}
            >
              Deselect All
            </Button>
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              px="15px"
              py="5px"
              onClick={handleBatchActivate}
            >
              Activate All
            </Button>
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              px="15px"
              py="5px"
              onClick={handleBatchDelete}
            >
              Delete All
            </Button>
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              px="15px"
              py="5px"
              onClick={handleBatchNotify}
            >
              Notify All
            </Button>
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="10px"
              px="15px"
              py="5px"
              onClick={() => exportToExcel(toast)}
            >
              Export to Excel
            </Button>
          </Flex>
          <Flex align="center"></Flex>
        </Flex>
  
        {isVisible && (
          <>
            <Box px="25px" mb="12px">
              <Input
                placeholder="Search by username..."
                onChange={(e) => debouncedSetSearch(e.target.value)}
                size="md"
                bg="whiteAlpha.800"
                _placeholder={{ color: 'gray.500' }}
              />
            </Box>
  
            {isLoading ? (
              <Flex justify="center" align="center" py="20px">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </Flex>
            ) : (
              <>
                <Table variant="simple" color="gray.500" mb="24px" mt="12px">
                  <Thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <Th
                            key={header.id}
                            pe="10px"
                            borderColor={borderColor}
                            cursor="pointer"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <Flex
                              justifyContent="space-between"
                              align="center"
                              fontSize={{ sm: '10px', lg: '12px' }}
                              color="gray.400"
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </Flex>
                          </Th>
                        ))}
                      </Tr>
                    ))}
                  </Thead>
                  <Tbody>
                    {paginatedRows.map((row) => (
                      <Tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <Td
                            key={cell.id}
                            fontSize={{ sm: '14px' }}
                            minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                            borderColor="transparent"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </Td>
                        ))}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Flex justifyContent="center" mt={4} mb={4}>
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    isDisabled={currentPage === 1}
                    mr={2}
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      variant={currentPage === index + 1 ? 'solid' : 'outline'}
                      mx={1}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    isDisabled={currentPage === totalPages}
                    ml={2}
                  >
                    Next
                  </Button>
                </Flex>
              </>
            )}
          </>
        )}
  
        <UserModal
          isOpen={isOpen}
          onClose={onClose}
          userData={newUser}
          mode={mode}
          onSubmit={handleSubmit}
          error={error}
        />
  
        <UserFilterModal
          isOpen={isFilterOpen}
          onClose={onFilterClose}
          onFilterSuccess={handleFilterSuccess}
        />
  
        <Modal isOpen={isActivateModalOpen} onClose={onActivateModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Activation</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to activate {selectedRows.length} users?
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onActivateModalClose}>
                Cancel
              </Button>
              <Button
                variant="darkBrand"
                color="white"
                onClick={confirmBatchActivate}
              >
                Activate
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
  
        <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Deletion</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete {selectedRows.length} users?
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onDeleteModalClose}>
                Cancel
              </Button>
              <Button
                variant="darkBrand"
                color="white"
                onClick={confirmBatchDelete}
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
  
        <Modal isOpen={isNotifyModalOpen} onClose={onNotifyModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Notification</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to send notifications to {selectedRows.length} users?
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onNotifyModalClose}>
                Cancel
              </Button>
              <Button
                variant="darkBrand"
                color="white"
                onClick={confirmBatchNotify}
              >
                Notify
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
    );
  }