'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { AgencyDto } from '@/services/dtos/agencies/AgencyDto';
import { API_DOMAIN, DOMAIN } from '@/utils/constants';
import axios from 'axios';
import { RoleDto } from '@/services/dtos';
import { toast } from 'react-toastify';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
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
import { Button } from "@/components/ui/button";

enum SortDirection {
    ASC = 'asc',
    DESC = 'desc',
}

type SortConfig = {
    key: keyof AgencyDto;
    direction: SortDirection;
};

// Define default column visibility
const defaultColumnVisibility: Record<string, boolean> = {
    name: true,
    location: true,
    capacity: false, // Default hidden
    availableSlots: true,
    createdAt: false, // Default hidden
};

export default function AgenciesList() {
    const { data: session } = useSession();
    const router = useRouter();

    const [agencies, setAgencies] = useState<AgencyDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: SortDirection.ASC });
    const [currentPage, setCurrentPage] = useState(1);
    const agenciesPerPage = 5;

    // Initialize visible columns with default values
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(defaultColumnVisibility);

    const fetchAgencies = useCallback(async () => {
        if (!session) return;
        if (session.user?.role !== RoleDto.AGENCY_ADMIN && session.user?.role !== RoleDto.SUPER_ADMIN) {
            return;
        }
        setIsLoading(true);
        try {
            const sortKey = sortConfig.key;
            const sortDir = sortConfig.direction;
            const adminId = session.user?.id;
            if (!adminId) return;
            const url = `${API_DOMAIN}/agencies/admin-agencies/${adminId}?search=${encodeURIComponent(
                searchTerm
            )}&sortKey=${sortKey}&sortDir=${sortDir}`;

            const res = await axios.get(url, {
                headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
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

    useEffect(() => {
        fetchAgencies();
    }, [session, searchTerm, sortConfig, fetchAgencies]);

    const sortedAndFilteredAgencies = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = agencies.filter((agency) => {
            return (
                agency.name?.toLowerCase().includes(lowerSearch) ||
                agency.location?.toLowerCase().includes(lowerSearch)
            );
        });

        const sorted = [...filtered].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            const aStr = aVal == null ? '' : String(aVal);
            const bStr = bVal == null ? '' : String(bVal);
            return sortConfig.direction === SortDirection.ASC
                ? aStr.localeCompare(bStr, undefined, { numeric: true })
                : bStr.localeCompare(aStr, undefined, { numeric: true });
        });

        setCurrentPage(1);
        return sorted;
    }, [agencies, searchTerm, sortConfig]);

    const indexOfLastAgency = currentPage * agenciesPerPage;
    const indexOfFirstAgency = indexOfLastAgency - agenciesPerPage;
    const currentAgencies = sortedAndFilteredAgencies.slice(indexOfFirstAgency, indexOfLastAgency);
    const totalPages = Math.ceil(sortedAndFilteredAgencies.length / agenciesPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleSort = (key: keyof AgencyDto) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC,
        }));
    };

    const handleEdit = (agencyId: number | undefined) => {
        router.push(`/admin/agencies/${agencyId}/edit`);
    };

    const handleDelete = async (agencyId: number | undefined) => {
        if (!window.confirm('Are you sure you want to delete this agency?')) return;
        try {
            await axios.delete(`${API_DOMAIN}/agencies/${agencyId}`);
            toast.success('Agency deleted successfully');
            setAgencies((prev) => prev.filter((ag) => ag.id !== agencyId));
        } catch (error) {
            console.error('Error deleting agency:', error);
            toast.error('Failed to delete agency');
        }
    };

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Agencies</h1>
                {session?.user?.role === RoleDto.SUPER_ADMIN && (
                    <Button onClick={() => router.push(`${DOMAIN}/admin/agencies/new`)} variant="default">
                        + Add New Agency
                    </Button>
                )}
            </div>

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

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        {visibleColumns.name && <TableHead>Name</TableHead>}
                        {visibleColumns.location && <TableHead>Location</TableHead>}
                        {visibleColumns.capacity && <TableHead>Capacity</TableHead>}
                        {visibleColumns.availableSlots && <TableHead>Available Slots</TableHead>}
                        {visibleColumns.createdAt && <TableHead>Created At</TableHead>}
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentAgencies.map((agency, index) => (
                        <TableRow key={agency.id}>
                            <TableCell>{indexOfFirstAgency + index + 1}</TableCell>
                            {visibleColumns.name && <TableCell>{agency.name}</TableCell>}
                            {visibleColumns.location && <TableCell>{agency.location || 'N/A'}</TableCell>}
                            {visibleColumns.capacity && <TableCell>{agency.capacity ?? 0}</TableCell>}
                            {visibleColumns.availableSlots && <TableCell>{agency.availableSlots ?? 0}</TableCell>}
                            {visibleColumns.createdAt && <TableCell>{agency.createdAt ? new Date(agency.createdAt).toLocaleDateString() : 'N/A'}</TableCell>}
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost"><MoreHorizontal /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleEdit(agency.id)}>Edit</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleDelete(agency.id)}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
