// src/app/admin/envois/page.tsx – liste des envois pour l'Agency Admin (Auth.js v5)
// -----------------------------------------------------------------------------
// • Server Component : récupère la session via `auth()`.
// • Filtre les envois dont l'agence de départ appartient à l'admin connecté.
// • Passe la liste à un composant client <EnvoisTable> qui affiche le tableau
//   et un bouton "Suivi" -> /admin/envois/{id}/tracking.
// -----------------------------------------------------------------------------
import { notFound } from "next/navigation";
import { auth } from "@/auth/auth";
import { prisma } from "@/utils/db";
import { RoleDto } from "@/services/dtos";
import EnvoisListe from "@/components/admin/collections/EnvoisList";
// import EnvoisTable from "@/components/admin/EnvoisTable";

export const dynamic = "force-dynamic"; // revalider à chaque requête

export default async function AdminEnvoisPage() {
    /* 1 – Session & rôle */
    const session = await auth();
    if (!session) return notFound();
    if (![RoleDto.AGENCY_ADMIN, RoleDto.SUPER_ADMIN].includes(session.user.role as RoleDto))
        return notFound();

    /* 2 – Déterminer les agences dont l'admin est responsable */
    let agencyIds: number[] = [];
    if (session.user.role === RoleDto.SUPER_ADMIN) {
        // super‑admin : accès toutes agences
        const ids = await prisma.agency.findMany({ select: { id: true } });
        agencyIds = ids.map((a) => a.id);
    } else {
        const staff = await prisma.agencyStaff.findMany({
            where: { staffId: Number(session.user.id), staffRole: RoleDto.AGENCY_ADMIN },
            select: { agencyId: true },
        });
        agencyIds = staff.map((s) => s.agencyId);
        if (agencyIds.length === 0) return notFound();
    }

    /* 3 – Récupérer les envois */
    const envois = await prisma.envoi.findMany({
        where: { departureAgencyId: { in: agencyIds } },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            trackingNumber: true,
            envoiStatus: true,
            paid: true,
            totalWeight: true,
            totalPrice: true,
            departureDate: true,
            arrivalDate: true,
            client: { select: { name: true } },
        },
    });

    /* 4 – Rendu */
    return (
        <div className="container py-8 space-y-6">
            <h1 className="text-2xl font-bold">Envois de mon agence</h1>
            <EnvoisListe envois={envois} />
        </div>
    );
}
