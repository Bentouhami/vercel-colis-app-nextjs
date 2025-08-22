'use client'

import { useSession } from 'next-auth/react'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import { Role } from '@prisma/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Users, Building2, DollarSign, UserCheck, Package, TrendingUp, Calendar, Clock, CheckCircle, AlertTriangle, RefreshCw, CreditCard, XCircle } from 'lucide-react'
import { DashboardSummaryDto, AgencyDashboardDto, AccountantDashboardDto } from '@/services/dtos/admin/DashboardDto'

export default function AdminDashboard() {
    const { data: session } = useSession()
    const { data, loading, error, refresh } = useAdminDashboard()

    if (loading) {
        return <DashboardSkeleton />
    }

    if (error) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={refresh} className="mt-4">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                </Button>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="p-6">
                <Alert>
                    <AlertDescription>Aucune donnée disponible</AlertDescription>
                </Alert>
            </div>
        )
    }

    const userRole = session?.user?.role as Role

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard Admin</h1>
                    <p className="text-muted-foreground">
                        {userRole === Role.SUPER_ADMIN && 'Vue d&apos;ensemble globale'}
                        {userRole === Role.AGENCY_ADMIN && 'Gestion de votre agence'}
                        {userRole === Role.ACCOUNTANT && 'Suivi financier'}
                    </p>
                </div>
                <Button onClick={refresh} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser
                </Button>
            </div>

            {/* Render based on role */}
            {userRole === Role.SUPER_ADMIN && <SuperAdminDashboard data={data as DashboardSummaryDto} />}
            {userRole === Role.AGENCY_ADMIN && <AgencyAdminDashboard data={data as AgencyDashboardDto} />}
            {userRole === Role.ACCOUNTANT && <AccountantDashboard data={data as AccountantDashboardDto} />}
        </div>
    )
}

function SuperAdminDashboard({ data }: { data: DashboardSummaryDto }) {
    return (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Agences</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalAgencies}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalClients}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenus Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalRevenue.toFixed(2)}€</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Admins Actifs</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.activeAdmins}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Envois ce Mois
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{data.monthlyShipments}</div>
                        <div className="flex items-center gap-2 mt-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-muted-foreground">
                                {data.monthlyGrowth > 0 ? '+' : ''}{data.monthlyGrowth}% vs mois dernier
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Alertes Système</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {data.systemAlerts.map((alert, index) => (
                            <Alert key={index} variant={alert.type === 'error' ? 'destructive' : 'default'}>
                                <AlertDescription>{alert.message}</AlertDescription>
                            </Alert>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Agencies */}
            <Card>
                <CardHeader>
                    <CardTitle>Agences Récentes</CardTitle>
                    <CardDescription>Performance des dernières agences</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.recentAgencies.map((agency) => (
                            <div key={agency.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <h3 className="font-medium">{agency.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {agency.clients} clients • {agency.admins} admins
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{agency.revenue.toFixed(2)}€</p>
                                    <Badge variant={agency.status === 'active' ? 'default' : 'secondary'}>
                                        {agency.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

function AgencyAdminDashboard({ data }: { data: AgencyDashboardDto }) {
    return (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Envois</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.agencyShipments}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenus Agence</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.agencyRevenue.toFixed(2)}€</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.agencyClients}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">RDV à Venir</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.upcomingAppointments}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Daily Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Aujourd&apos;hui
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.todayShipments}</div>
                        <p className="text-sm text-muted-foreground">Envois du jour</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            En Attente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.pendingShipments}</div>
                        <p className="text-sm text-muted-foreground">À traiter</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            Terminés
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.completedShipments}</div>
                        <p className="text-sm text-muted-foreground">Livrés</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Clients Récents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.recentClients.map((client) => (
                                <div key={client.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{client.name}</p>
                                        <p className="text-sm text-muted-foreground">{client.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm">{client.totalShipments} envois</p>
                                        <p className="text-xs text-muted-foreground">Dernier: {client.lastShipment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Prochains RDV</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.upcomingAppointmentsList.map((appointment) => (
                                <div key={appointment.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{appointment.client}</p>
                                        <p className="text-sm text-muted-foreground">{appointment.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm">{appointment.date}</p>
                                        <p className="text-xs text-muted-foreground">{appointment.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Alerts */}
            <Card>
                <CardHeader>
                    <CardTitle>Alertes Agence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {data.systemAlerts.map((alert, index) => (
                        <Alert key={index} variant={alert.type === 'error' ? 'destructive' : 'default'}>
                            <AlertDescription>{alert.message}</AlertDescription>
                        </Alert>
                    ))}
                </CardContent>
            </Card>
        </>
    )
}

function AccountantDashboard({ data }: { data: AccountantDashboardDto }) {
    return (
        <>
            {/* Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenus Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalRevenue.toFixed(2)}€</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Envois Impayés</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.unpaidShipments}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Paiements en Attente</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.pendingPayments}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Paiements Échoués</CardTitle>
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.failedPayments}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Revenue Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenus Mensuels</CardTitle>
                    <CardDescription>Évolution des revenus sur les 4 derniers mois</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.monthlyRevenues.map((month) => (
                            <div key={month.month} className="flex items-center justify-between">
                                <span className="font-medium">{month.month}</span>
                                <span className="text-lg font-bold">{month.revenue.toFixed(2)}€</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
                <CardHeader>
                    <CardTitle>Transactions Récentes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.recentTransactions.map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">{transaction.client}</p>
                                    <p className="text-sm text-muted-foreground">{transaction.type}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{transaction.amount.toFixed(2)}€</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={
                                            transaction.status === 'paid' ? 'default' :
                                                transaction.status === 'pending' ? 'secondary' : 'destructive'
                                        }>
                                            {transaction.status}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{transaction.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Financial Alerts */}
            <Card>
                <CardHeader>
                    <CardTitle>Alertes Financières</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {data.financialAlerts.map((alert, index) => (
                        <Alert key={index} variant={alert.type === 'error' ? 'destructive' : 'default'}>
                            <AlertDescription>{alert.message}</AlertDescription>
                        </Alert>
                    ))}
                </CardContent>
            </Card>
        </>
    )
}

function DashboardSkeleton() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </div>
                <Skeleton className="h-10 w-24" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-4 w-24" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-24 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
