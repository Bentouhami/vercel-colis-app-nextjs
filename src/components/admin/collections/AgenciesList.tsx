// path: src/components/admin/collections/AgenciesList.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { AgencyDto } from '@/services/dtos/agencies/AgencyDto';
import {API_DOMAIN, DOMAIN} from '@/utils/constants';
import axios from 'axios';
import { RoleDto } from '@/services/dtos';
import { toast } from 'react-toastify';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from 'react-bootstrap';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

enum SortDirection {
    ASC = 'asc',
    DESC = 'desc',
}

type SortConfig = {
    key: keyof AgencyDto;
    direction: SortDirection;
};

export default function AgenciesList() {
    const { data: session } = useSession();
    const router = useRouter();

    // Local state for agencies data, loading state, search term, and pagination
    const [agencies, setAgencies] = useState<AgencyDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: SortDirection.ASC });
    const [currentPage, setCurrentPage] = useState(1);
    const agenciesPerPage = 5;

    // State for toggling columns (make sure this is defined at the top)
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
        name: true,
        location: true,
        capacity: true,
        availableSlots: true,
        createdAt: true,
    });

    // ----------------------
    // FETCH AGENCIES
    // ----------------------
    const fetchAgencies = useCallback(async () => {
        if (!session) return;
        // Only for AGENCY_ADMIN or SUPER_ADMIN
        if (
            session.user?.role !== RoleDto.AGENCY_ADMIN &&
            session.user?.role !== RoleDto.SUPER_ADMIN
        ) {
            return;
        }
        setIsLoading(true);
        try {
            const sortKey = sortConfig.key;
            const sortDir = sortConfig.direction;
            const adminId = session.user?.id; // make sure adminId is defined
            if (!adminId) return;
            const url = `${API_DOMAIN}/agencies/admin-agencies/${adminId}?search=${encodeURIComponent(
                searchTerm
            )}&sortKey=${sortKey}&sortDir=${sortDir}`;

            const res = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                    Pragma: 'no-cache',
                    Expires: '0',
                },
            });
            if (res.status === 200) {
                setAgencies(res.data);
            } else {
                throw new Error('Failed to fetch agencies');
            }
        } catch (error) {
            console.error('Error fetching agencies:', error);
            toast.error('Failed to fetch agencies');
        } finally {
            setIsLoading(false);
        }
    }, [session, searchTerm, sortConfig]);

    // Fetch agencies on dependency changes
    useEffect(() => {
        fetchAgencies();
    }, [session, searchTerm, sortConfig, fetchAgencies]);

    // ----------------------
    // FILTERING & SORTING (Memoized)
    // ----------------------
    const sortedAndFilteredAgencies = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        // Filter agencies
        const filtered = agencies.filter((agency) => {
            return (
                agency.name?.toLowerCase().includes(lowerSearch) ||
                agency.location?.toLowerCase().includes(lowerSearch)
            );
        });
        // Sort the filtered agencies
        const sorted = [...filtered].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            const aStr = aVal == null ? '' : String(aVal);
            const bStr = bVal == null ? '' : String(bVal);
            if (sortConfig.direction === SortDirection.ASC) {
                return aStr.localeCompare(bStr, undefined, { numeric: true });
            }
            return bStr.localeCompare(aStr, undefined, { numeric: true });
        });
        // Reset current page if searchTerm changes
        setCurrentPage(1);
        return sorted;
    }, [agencies, searchTerm, sortConfig]);

    // ----------------------
    // PAGINATION
    // ----------------------
    const indexOfLastAgency = currentPage * agenciesPerPage;
    const indexOfFirstAgency = indexOfLastAgency - agenciesPerPage;
    const currentAgencies = sortedAndFilteredAgencies.slice(indexOfFirstAgency, indexOfLastAgency);
    const totalPages = Math.ceil(sortedAndFilteredAgencies.length / agenciesPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // ---------------------
    // CRUD ACTIONS
    // ---------------------
    const handleEdit = (agencyId: number | undefined) => {
        router.push(`${DOMAIN}/admin/agencies/${agencyId}/edit`);
    };

    const handleDelete = async (agencyId: number | undefined) => {
        if (!window.confirm('Are you sure you want to delete this agency?')) return;
        try {
            await axios.delete(`${API_DOMAIN}/agencies/${agencyId}`);
            toast.success('Agency deleted successfully');
            // Remove the deleted agency from state
            setAgencies((prev) => prev.filter((ag) => ag.id !== agencyId));
        } catch (error) {
            console.error('Error deleting agency:', error);
            toast.error('Failed to delete agency');
        }
    };

    const handleAddNew = () => {
        if (session?.user?.role === RoleDto.SUPER_ADMIN) {
            router.push(`${DOMAIN}/admin/agencies/new`);
        }
    };

    // ---------------------
    // HANDLING SORTING
    // ---------------------
    const handleSort = (key: keyof AgencyDto) => {
        let direction = SortDirection.ASC;
        if (sortConfig.key === key && sortConfig.direction === SortDirection.ASC) {
            direction = SortDirection.DESC;
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="space-y-6 p-4">
            {/* Heading + Add New Button (SUPER_ADMIN only) */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Agencies</h1>
                {session?.user?.role === RoleDto.SUPER_ADMIN && (
                    <Button onClick={handleAddNew} variant="default">
                        + Add New Agency
                    </Button>
                )}
            </div>

            {/* Search Input & Toggle Columns */}
            <div className="flex gap-4 items-center">
                <input
                    type="text"
                    placeholder="Search by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 border px-2 py-1 rounded"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Toggle Columns</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Columns</DropdownMenuLabel>
                        {Object.keys(visibleColumns).map((column) => (
                            <DropdownMenuItem key={column} onSelect={(e) => e.preventDefault()}>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={visibleColumns[column]}
                                        onChange={() =>
                                            setVisibleColumns((prev: Record<string, boolean>) => ({
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

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        {visibleColumns.name && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('name')}>
                                    Name
                                </Button>
                            </TableHead>
                        )}
                        {visibleColumns.location && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('location')}>
                                    Location
                                </Button>
                            </TableHead>
                        )}
                        {visibleColumns.capacity && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('capacity')}>
                                    Capacity
                                </Button>
                            </TableHead>
                        )}
                        {visibleColumns.availableSlots && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('availableSlots')}>
                                    Available Slots
                                </Button>
                            </TableHead>
                        )}
                        {visibleColumns.createdAt && (
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('createdAt')}>
                                    Created At
                                </Button>
                            </TableHead>
                        )}
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentAgencies.map((agency) => (
                        <TableRow key={agency.id}>
                            {visibleColumns.name && <TableCell>{agency.name}</TableCell>}
                            {visibleColumns.location && <TableCell>{agency.location || 'N/A'}</TableCell>}
                            {visibleColumns.capacity && <TableCell>{agency.capacity ?? 0}</TableCell>}
                            {visibleColumns.availableSlots && <TableCell>{agency.availableSlots ?? 0}</TableCell>}
                            {visibleColumns.createdAt && (
                                <TableCell>
                                    {agency.createdAt ? new Date(agency.createdAt).toLocaleDateString() : 'N/A'}
                                </TableCell>
                            )}
                            <TableCell className="text-right">
                                {(session?.user?.role === RoleDto.AGENCY_ADMIN ||
                                    session?.user?.role === RoleDto.SUPER_ADMIN) && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleEdit(agency.id)}>Edit</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleDelete(agency.id)}>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-between items-center pt-2">
                <div>
                    Showing {indexOfFirstAgency + 1}–{Math.min(indexOfLastAgency, sortedAndFilteredAgencies.length)} of{' '}
                    {sortedAndFilteredAgencies.length} Agencies
                </div>
                <div className="space-x-2">
                    <Button variant="outline" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
