// path: src/app/admin/stats/page.tsx

import { notFound } from "next/navigation";
import { auth } from "@/auth/auth";
import { RoleDto } from "@/services/dtos";
import DashboardCharts from "@/components/admin/charts/DashboardCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
  const session = await auth();
  if (!session) return notFound();
  const role = session.user?.role as RoleDto | undefined;
  if (!role || ![RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT].includes(role)) {
    return notFound();
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Statistiques</h1>
      </div>

      {/* Charts include a built-in sélecteur (Semaine/Mois) */}
      <Card>
        <CardHeader>
          <CardTitle>Vue d'ensemble</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardCharts />
          <p className="text-sm text-muted-foreground mt-3">
            Utilisez le sélecteur du graphique pour basculer entre Semaine et Mois.
          </p>
        </CardContent>
      </Card>

      {/* Placeholder Year tab */}
      <Card>
        <CardHeader>
          <CardTitle>Plage temporelle</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="year" className="w-full">
            <TabsList className="grid grid-cols-3 gap-2">
              <TabsTrigger value="week">Semaine</TabsTrigger>
              <TabsTrigger value="month">Mois</TabsTrigger>
              <TabsTrigger value="year">Année</TabsTrigger>
            </TabsList>
            <TabsContent value="week">
              <p className="text-sm text-muted-foreground">
                Utilisez le sélecteur du graphique ci-dessus pour la vue Semaine.
              </p>
            </TabsContent>
            <TabsContent value="month">
              <p className="text-sm text-muted-foreground">
                Utilisez le sélecteur du graphique ci-dessus pour la vue Mois.
              </p>
            </TabsContent>
            <TabsContent value="year">
              <div className="rounded-md border p-6">
                <p className="text-sm text-muted-foreground">
                  Vue annuelle: bientôt disponible.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

