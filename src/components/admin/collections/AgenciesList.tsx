'use client';

import React, {useCallback, useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import axios from 'axios';
import {MoreHorizontal} from 'lucide-react';

import {AgencyDto} from '@/services/dtos/agencies/AgencyDto';
import {RoleDto} from '@/services/dtos';
import {getAgenciesForAdmin} from '@/services/frontend-services/agencies/AgencyService';
import {DOMAIN, API_DOMAIN} from '@/utils/constants';

import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Input} from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';

enum SortDirection {
    ASC = 'asc',
    DESC = 'desc',
}

type SortConfig = {
    key: keyof AgencyDto;
    direction: SortDirection;
};

const defaultColumnVisibility: Record<string, boolean> = {
    name: true,
    location: true,
    capacity: false,
    availableSlots: true,
    createdAt: false,
};

export default function AgenciesList() {
    const {data: session} = useSession();
    const router = useRouter();

    const [agencies, setAgencies] = useState<AgencyDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({key: 'name', direction: SortDirection.ASC});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const agenciesPerPage = 5;

    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(defaultColumnVisibility);

    const fetchAgencies = useCallback(async () => {
        if (!session?.user) return <div>Veuillez vous connecter.</div>;
        if (session.user.role !== RoleDto.SUPER_ADMIN && session.user.role !== RoleDto.AGENCY_ADMIN) {
            return <div>Accès refusé</div>;
        }

        setIsLoading(true);

        try {
            const res = await getAgenciesForAdmin({
                page: currentPage,
                limit: agenciesPerPage,
                search: searchTerm,
                sortKey: sortConfig.key,
                sortDir: sortConfig.direction,
            });

            if (res.status === 200) {
            }

            setAgencies(res);
            setTotalPages(res.totalPages);

        } catch (error) {
            toast.error('Failed to fetch agencies');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchTerm, session?.user, sortConfig.direction, sortConfig.key]);

    useEffect(() => {
        fetchAgencies();
    }, [fetchAgencies]);

    const handleSort = (key: keyof AgencyDto) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC,
        }));
    };

    const handleEdit = (agencyId: number | undefined) => {
        if (!agencyId) return;
        router.push(`/admin/agencies/${agencyId}/edit`);
    };

    const handleDelete = async (agencyId: number | undefined) => {
        if (!agencyId) return;
        if (!window.confirm('Are you sure you want to delete this agency?')) return;

        try {
            await axios.delete(`${API_DOMAIN}/agencies/${agencyId}`);
            toast.success('Agency deleted successfully');
            setAgencies((prev) => prev.filter((agency) => agency.id !== agencyId));
        } catch (error) {
            toast.error('Failed to delete agency');
        }
    };

    return (
        <div className="space-y-6 p-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Agencies</h1>
                {session?.user?.role === RoleDto.SUPER_ADMIN && (
                    <Button onClick={() => router.push(`${DOMAIN}/admin/agencies/new`)} variant="default">
                        + Add New Agency
                    </Button>
                )}
            </div>

            {/* Search and Toggle Columns */}
            <div className="flex gap-4 items-center">
                <Input
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

            {/* Agencies Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        {visibleColumns.name && <TableHead onClick={() => handleSort('name')}>Name</TableHead>}
                        {visibleColumns.location &&
                            <TableHead onClick={() => handleSort('location')}>Location</TableHead>}
                        {visibleColumns.capacity &&
                            <TableHead onClick={() => handleSort('capacity')}>Capacity</TableHead>}
                        {visibleColumns.availableSlots &&
                            <TableHead onClick={() => handleSort('availableSlots')}>Available Slots</TableHead>}
                        {visibleColumns.createdAt &&
                            <TableHead onClick={() => handleSort('createdAt')}>Created At</TableHead>}
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {agencies.map((agency, index) => (
                        <TableRow key={agency.id}>
                            <TableCell>{(currentPage - 1) * agenciesPerPage + index + 1}</TableCell>
                            {visibleColumns.name && <TableCell>{agency.name}</TableCell>}
                            {visibleColumns.location && <TableCell>{agency.location ?? 'N/A'}</TableCell>}
                            {visibleColumns.capacity && <TableCell>{agency.capacity ?? 0}</TableCell>}
                            {visibleColumns.availableSlots && <TableCell>{agency.availableSlots ?? 0}</TableCell>}
                            {visibleColumns.createdAt && (
                                <TableCell>{agency.createdAt ? new Date(agency.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                            )}
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost"><MoreHorizontal/></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleEdit(agency.id)}>Edit</DropdownMenuItem>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(agency.id)}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious size="default" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}/>
                    </PaginationItem>
                    <PaginationItem>
                        <span className="text-sm font-semibold">Page {currentPage} sur {totalPages}</span>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext size="default" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}/>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}