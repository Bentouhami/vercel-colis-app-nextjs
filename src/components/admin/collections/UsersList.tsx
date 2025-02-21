// path: src/components/lists/UsersList.tsx

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {ArrowUpDown, ChevronDown, MoreHorizontal} from 'lucide-react';
import {toast} from 'react-toastify';
import {ListSkeleton} from "@/components/skeletons/ListSkeleton";
import axios from "axios";
import {format} from 'date-fns';
import {DOMAIN, API_DOMAIN} from "@/utils/constants";
import {Roles} from "@/services/dtos";

type User = {
    id?: string;
    userNumber?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    role?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    fax?: string;
    additionalInfo?: string;
    paymentTermDays?: number;
    isEnterprise?: boolean;
    isVerified?: boolean;
    isEnabled?: boolean;
    createdAt?: Date;
    lastLogin?: Date;
    status?: string;
    companyName?: string;
    companyNumber?: string;
    exportNumber?: string;
    vatNumber?: string;
};

type SortConfig = {
    key: keyof User;
    direction: 'asc' | 'desc';
};

interface UsersListProps {
    roles?: Roles[];
}

export default function UsersList({roles}: UsersListProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({key: 'userNumber', direction: 'asc'});
    const [selectedRole, setSelectedRole] = useState<string>("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // State for filters
    const [filters, setFilters] = useState({
        userNumber: '',
        firstName: '',
        lastName: '',
        name: '',
        roles: '',
        email: '',
        phone: '',
        isEnterprise: '',
        isVerified: '',
        isEnabled: '',
        companyName: '',
        companyNumber: '',
        exportNumber: '',
        vatNumber: '',
    });

// State to manage visible columns
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
        userNumber: true,
        firstName: false,
        lastName: false,
        name: true,
        role: true,
        email: true,
        phone: false,
        vatNumber: false,
        isEnterprise: false,
        isVerified: false,
        isEnabled: false,
        companyName: false,
        companyNumber: false,
        exportNumber: false,
        lastLogin: false,
        createdAt: false,
    });

    // Fetch users from the API
    const fetchUsers = async () => {
        if (!roles) {
            console.warn('Role is undefined, skipping fetchUsers');
            return;
        }

        setLoading(true);
        setError(null);

        try {

            const response = await axios.get(`${API_DOMAIN}/users/role/${roles}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const data = response.data;
                setUsers(data);
                setFilteredUsers(data);
            } else {
                throw new Error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users. Please try again later.');
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    // Apply filters to the users list
    const applyFilters = (users: User[]) => {
        return users.filter((user) => {
            return (
                (!filters.userNumber || user.userNumber?.includes(filters.userNumber)) &&
                (!filters.firstName || user.firstName?.toLowerCase().includes(filters.firstName.toLowerCase())) &&
                (!filters.lastName || user.lastName?.toLowerCase().includes(filters.lastName.toLowerCase())) &&
                (!filters.name || user.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
                (!filters.roles || user.role?.toLowerCase().includes(filters.roles.toLowerCase())) &&
                (!filters.email || user.email?.toLowerCase().includes(filters.email.toLowerCase())) &&
                (!filters.phone || user.phone?.includes(filters.phone)) &&
                (!filters.isEnterprise || user.isEnterprise?.toString() === filters.isEnterprise) &&
                (!filters.isVerified || user.isVerified?.toString() === filters.isVerified) &&
                (!filters.isEnabled || user.isEnabled?.toString() === filters.isEnabled) &&
                (!filters.companyName || user.companyName?.toLowerCase().includes(filters.companyName.toLowerCase())) &&
                (!filters.companyNumber || user.companyNumber?.includes(filters.companyNumber)) &&
                (!filters.exportNumber || user.exportNumber?.includes(filters.exportNumber)) &&
                (!filters.vatNumber || user.vatNumber?.includes(filters.vatNumber))
            );
        });
    };

    useEffect(() => {
        setFilteredUsers(applyFilters(users));
    }, [users, filters, applyFilters]);

    // Handle filter changes
    const handleFilterChange = (key: string, value: string) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [key]: value,
        }));
    };

    // Handle sorting
    const handleSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({key, direction});

        const sortedUsers = [...filteredUsers].sort((a, b) => {
            const aValue = a[key];
            const bValue = b[key];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
                return direction === 'asc' ? (aValue === bValue ? 0 : aValue ? -1 : 1) : (aValue === bValue ? 0 : aValue ? 1 : -1);
            } else if (aValue instanceof Date && bValue instanceof Date) {
                return direction === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
            }
            return 0;
        });
        setFilteredUsers(sortedUsers);
    };

    // Handle edit action
    const handleEdit = (userId: string) => {
        router.push(`${DOMAIN}/dashboard/users/${userId}/edit`);
    };

    // Handle delete action
    const handleDelete = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`/api/v1/users/${userId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete user');
                }
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user');
            }
        }
    };

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, [roles]);

    // Apply filters and search term whenever filters or search term change
    useEffect(() => {
        const filtered = users.filter(user => {
            // If the selectedRole is not "ALL", only include users matching that role.
            if (selectedRole !== "ALL" && user.role !== selectedRole) {
                return false;
            }

            const searchLower = searchTerm.toLowerCase();
            return (
                user.userNumber?.toLowerCase().includes(searchLower) ||
                user.firstName?.toLowerCase().includes(searchLower) ||
                user.lastName?.toLowerCase().includes(searchLower) ||
                user.name?.toLowerCase().includes(searchLower) ||
                user.role?.toLowerCase().includes(searchLower) ||
                user.email?.toLowerCase().includes(searchLower) ||
                user.phone?.toLowerCase().includes(searchLower) ||
                user.vatNumber?.toLowerCase().includes(searchLower) ||
                user.companyName?.toLowerCase().includes(searchLower) ||
                user.companyNumber?.toLowerCase().includes(searchLower) ||
                user.exportNumber?.toLowerCase().includes(searchLower)
            );
        });
        setFilteredUsers(filtered);
        setCurrentPage(1);
    }, [searchTerm, users, selectedRole]);

    if (loading) {
        return <ListSkeleton/>;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="space-y-4">
            <Input
                placeholder="Filter by User Number"
                value={filters.userNumber}
                onChange={(e) => handleFilterChange('userNumber', e.target.value)}
            />
            {/* Search and Filters Section */}
            <div className="flex flex-wrap gap-4">
                <Input
                    type="text"
                    placeholder="Search users by name, email, phone, company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xl flex-grow"
                />
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="border rounded px-2 py-1"
                >
                    <option value="ALL">Filter by role</option>
                    <option value="CUSTOMER">Customer</option>
                    <option value="ADMIN">Admin</option>
                    <option value="ACCOUNTANT">Accountant</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                </select>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Display more fields <ChevronDown className="ml-2 h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                        {Object.keys(visibleColumns).map((column) => (
                            <DropdownMenuItem
                                key={column}
                                onSelect={(e) => e.preventDefault()} // Prevent a menu from closing
                            >
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={visibleColumns[column]}
                                        onChange={() =>
                                            setVisibleColumns((prev) => ({
                                                ...prev,
                                                [column]: !prev[column],
                                            }))
                                        }
                                    />
                                    <span>{column}</span>
                                </label>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Table Section */}
            <Table>
                <TableHeader>
                    <TableRow>
                        {visibleColumns.userNumber && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('userNumber')}>
                                    User Number
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                        )}
                        {visibleColumns.firstName && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('firstName')}>
                                    First Name
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                        )}
                        {visibleColumns.lastName && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('lastName')}>
                                    Last Name
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                        )}

                        {visibleColumns.name && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('name')}>
                                    Name
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                        )}
                        {visibleColumns.role && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('role')}>
                                    Role
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                        )}
                        {visibleColumns.email && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('email')}>
                                    Email
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                        )}
                        {visibleColumns.phone && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('phone')}>
                                    Phone
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                        )}
                        {visibleColumns.vatNumber && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('vatNumber')}>
                                    VAT Number
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                        )}
                        {visibleColumns.companyName && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('companyName')}>
                                    Company Name
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                        )}
                        {visibleColumns.companyNumber && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('companyNumber')}>
                                    Company Number
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                        )}
                        {visibleColumns.exportNumber && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('exportNumber')}>
                                    Export Number
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                        )}
                        {visibleColumns.lastLogin && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('lastLogin')}>
                                    Last Login
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                        )}
                        {visibleColumns.isEnterprise && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('isEnterprise')}>
                                    Enterprise
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                        )}
                        {visibleColumns.isVerified && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('isVerified')}>
                                    Verified
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                        )}
                        {visibleColumns.isEnabled && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('isEnabled')}>
                                    Enabled
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                        )}
                        {visibleColumns.createdAt && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('createdAt')}>
                                    Created At
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                        )}
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentUsers.map((user) => (
                        <TableRow key={user.id}>
                            {visibleColumns.userNumber && <TableCell>{user.userNumber}</TableCell>}
                            {visibleColumns.firstName && <TableCell>{user.firstName}</TableCell>}
                            {visibleColumns.lastName && <TableCell>{user.lastName}</TableCell>}
                            {visibleColumns.name && <TableCell>{user.name}</TableCell>}
                            {visibleColumns.role && <TableCell>{user.role}</TableCell>}
                            {visibleColumns.email && <TableCell>{user.email}</TableCell>}
                            {visibleColumns.phone && <TableCell>{user.phone}</TableCell>}
                            {visibleColumns.vatNumber && <TableCell>{user.vatNumber}</TableCell>}
                            {visibleColumns.companyName && <TableCell>{user.companyName}</TableCell>}
                            {visibleColumns.companyNumber && <TableCell>{user.companyNumber}</TableCell>}
                            {visibleColumns.exportNumber && <TableCell>{user.exportNumber}</TableCell>}
                            {visibleColumns.lastLogin && (
                                <TableCell>{user.lastLogin ? format(new Date(user.lastLogin), 'dd-MM-yyyy') : 'N/A'}</TableCell>
                            )}
                            {visibleColumns.isEnterprise && (
                                <TableCell>
                                    <span
                                        className={user.isEnterprise ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                        {user.isEnterprise ? "Yes" : "No"}
                                    </span>
                                </TableCell>
                            )}
                            {visibleColumns.isVerified && (
                                <TableCell>
                                    <span
                                        className={user.isVerified ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                        {user.isVerified ? "Yes" : "No"}
                                    </span>
                                </TableCell>
                            )}
                            {visibleColumns.isEnabled && (
                                <TableCell>
                                    <span
                                        className={user.isEnabled ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                        {user.isEnabled ? "Yes" : "No"}
                                    </span>
                                </TableCell>
                            )}
                            {visibleColumns.createdAt && (
                                <TableCell>{user.createdAt ? format(new Date(user.createdAt), 'dd-MM-yyyy') : 'N/A'}</TableCell>
                            )}
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                            Actions
                                        </DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={() => user.id && handleEdit(user.id)}>Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => user.id && handleDelete(user.id)}>Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Section */}
            <div className="flex justify-between items-center">
                <div>
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                </div>
                <div className="flex space-x-2">
                    <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </Button>
                    <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}