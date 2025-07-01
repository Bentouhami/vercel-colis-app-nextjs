// path: src/components/lists/UsersList.tsx
'use client';



import React, {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {ChevronDown, MoreHorizontal} from 'lucide-react';
import {toast} from 'sonner';
import {ListSkeleton} from '@/components/skeletons/ListSkeleton';
import {format} from 'date-fns';
import {getUsers} from '@/services/frontend-services/UserService';
import {ProfileDto, RoleDto} from '@/services/dtos';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {API_DOMAIN} from "@/utils/constants";

export default function UsersList() {
    const router = useRouter();
    const [users, setUsers] = useState<ProfileDto[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<ProfileDto[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('ALL');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getUsers();

            if (data) {
                setUsers(data);
                setFilteredUsers(data);
            }
        } catch (e) {
            setError('Erreur lors du chargement des utilisateurs.');
            toast.error('Erreur de récupération');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    },[fetchUsers]);

    const handleDelete = async (id: number) => {
        if (!confirm('Confirmer la suppression de cet utilisateur ?')) return;

        try {
            const res = await fetch(`${API_DOMAIN}/users/${id}`, {method: 'DELETE'});
            if (!res.ok) throw new Error();
            toast.success('Utilisateur supprimé.');
            fetchUsers();
        } catch {
            toast.error('Erreur de suppression.');
        }
    };

    const handleEdit = (id: number) => router.push(`/admin/users/${id}/edit`);

    const handleSearch = (value: string) => setSearchTerm(value);

    const filtered = filteredUsers.filter(user => {
        const target = `${user.name} ${user.email} ${user.phoneNumber}`.toLowerCase();
        return (
            (selectedRole === 'ALL' || user.role === selectedRole) &&
            target.includes(searchTerm.toLowerCase())
        );
    });

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filtered.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filtered.length / usersPerPage);

    const paginate = (page: number) => setCurrentPage(page);

    if (loading) return <ListSkeleton/>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div className="space-y-4">
            <div className="flex gap-4 items-center">
                <Input
                    type="text"
                    placeholder="Recherche par nom, email, téléphone..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full max-w-lg"
                />
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="border rounded px-2 py-1"
                >
                    <option value="ALL">Tous les rôles</option>
                    <option value={RoleDto.CLIENT}>Client</option>
                    <option value={RoleDto.SUPER_ADMIN}>Super Admin</option>
                    <option value={RoleDto.AGENCY_ADMIN}>Admin Agence</option>
                    <option value={RoleDto.ACCOUNTANT}>Comptable</option>
                </select>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nom complet</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Vérifié</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentUsers.map(user => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phoneNumber}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <span className={user.isVerified ? "text-green-600" : "text-red-600"}>
                                    {user.isVerified ? "Oui" : "Non"}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={() => handleEdit(user.id)}>Modifier</DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(user.id)}>Supprimer</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex justify-between items-center mt-4">
                <div>
                    Affichage {indexOfFirstUser + 1} à {Math.min(indexOfLastUser, filtered.length)} sur {filtered.length}
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Précédent</Button>
                    <Button onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}>Suivant</Button>
                </div>
            </div>
        </div>
    );
}
