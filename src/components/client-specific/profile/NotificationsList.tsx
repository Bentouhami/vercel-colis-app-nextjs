"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Bell,
    Package,
    CreditCard,
    AlertTriangle,
    CheckCircle,
    Search,
    Filter,
    BookMarkedIcon as MarkAsUnread,
    Trash2,
    Settings,
    Calendar,
    Eye,
    EyeOff,
} from "lucide-react"

// Types
interface Notification {
    id: string
    type: "shipping" | "payment" | "system" | "promotion"
    title: string
    message: string
    date: string
    read: boolean
    priority: "low" | "medium" | "high"
    actionUrl?: string
}

// Mock data
const mockNotifications: Notification[] = [
    {
        id: "notif-001",
        type: "shipping",
        title: "Colis livré avec succès",
        message: "Votre colis COL-2024-001 a été livré à l'adresse indiquée. Le destinataire a confirmé la réception.",
        date: "2024-01-28T14:30:00Z",
        read: false,
        priority: "high",
        actionUrl: "/client/envois/COL-2024-001",
    },
    {
        id: "notif-002",
        type: "payment",
        title: "Paiement confirmé",
        message: "Votre paiement de 25,90 € pour l'envoi COL-2024-002 a été traité avec succès.",
        date: "2024-01-27T10:15:00Z",
        read: true,
        priority: "medium",
        actionUrl: "/client/profile/payments",
    },
    {
        id: "notif-003",
        type: "shipping",
        title: "Colis en transit",
        message: "Votre colis COL-2024-003 est actuellement en transit vers sa destination finale.",
        date: "2024-01-26T16:45:00Z",
        read: false,
        priority: "medium",
        actionUrl: "/client/envois/COL-2024-003",
    },
    {
        id: "notif-004",
        type: "system",
        title: "Mise à jour de sécurité",
        message: "Nous avons renforcé la sécurité de votre compte. Aucune action n'est requise de votre part.",
        date: "2024-01-25T09:00:00Z",
        read: true,
        priority: "low",
    },
    {
        id: "notif-005",
        type: "promotion",
        title: "Offre spéciale - 20% de réduction",
        message: "Profitez de 20% de réduction sur vos prochains envois avec le code WINTER2024.",
        date: "2024-01-24T12:00:00Z",
        read: false,
        priority: "low",
    },
    {
        id: "notif-006",
        type: "shipping",
        title: "Problème de livraison",
        message: "Nous rencontrons un délai pour la livraison de votre colis COL-2024-004. Nous vous tiendrons informé.",
        date: "2024-01-23T11:30:00Z",
        read: true,
        priority: "high",
        actionUrl: "/client/envois/COL-2024-004",
    },
]

const typeConfig = {
    shipping: {
        label: "Expédition",
        icon: Package,
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    payment: {
        label: "Paiement",
        icon: CreditCard,
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    system: {
        label: "Système",
        icon: Settings,
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        bgColor: "bg-gray-50 dark:bg-gray-950/20",
    },
    promotion: {
        label: "Promotion",
        icon: AlertTriangle,
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
}

const priorityConfig = {
    low: { label: "Faible", color: "bg-gray-100 text-gray-600" },
    medium: { label: "Moyenne", color: "bg-yellow-100 text-yellow-700" },
    high: { label: "Élevée", color: "bg-red-100 text-red-700" },
}

export default function NotificationsList() {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [priorityFilter, setPriorityFilter] = useState<string>("all")
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    // Filtered notifications
    const filteredNotifications = useMemo(() => {
        return notifications.filter((notification) => {
            const matchesSearch =
                notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                notification.message.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesType = typeFilter === "all" || notification.type === typeFilter
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "read" && notification.read) ||
                (statusFilter === "unread" && !notification.read)
            const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter

            return matchesSearch && matchesType && matchesStatus && matchesPriority
        })
    }, [notifications, searchTerm, typeFilter, statusFilter, priorityFilter])

    // Statistics
    const stats = useMemo(() => {
        const unreadCount = notifications.filter((n) => !n.read).length
        const todayCount = notifications.filter((n) => {
            const notifDate = new Date(n.date)
            const today = new Date()
            return notifDate.toDateString() === today.toDateString()
        }).length
        const highPriorityCount = notifications.filter((n) => n.priority === "high" && !n.read).length

        return {
            total: notifications.length,
            unread: unreadCount,
            today: todayCount,
            highPriority: highPriorityCount,
        }
    }, [notifications])

    const markAsRead = (id: string) => {
        setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
    }

    const markAsUnread = (id: string) => {
        setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: false } : notif)))
    }

    const deleteNotification = (id: string) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id))
    }

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

        if (diffInHours < 1) {
            return "À l'instant"
        } else if (diffInHours < 24) {
            return `Il y a ${Math.floor(diffInHours)}h`
        } else if (diffInHours < 48) {
            return "Hier"
        } else {
            return date.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
        }
    }

    return (
        <div
            className={`space-y-6 transition-all duration-700 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Bell className="h-6 w-6" />
                        Notifications
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Restez informé de l&apos;activité de votre compte</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={markAllAsRead}
                        disabled={stats.unread === 0}
                        className="gap-2 bg-transparent"
                    >
                        <CheckCircle className="h-4 w-4" />
                        Tout marquer comme lu
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="transition-all duration-300 hover:shadow-lg animate-slide-up">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className="transition-all duration-300 hover:shadow-lg animate-slide-up"
                    style={{ animationDelay: "100ms" }}
                >
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <EyeOff className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Non lues</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.unread}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className="transition-all duration-300 hover:shadow-lg animate-slide-up"
                    style={{ animationDelay: "200ms" }}
                >
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Aujourd&apos;hui</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.today}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className="transition-all duration-300 hover:shadow-lg animate-slide-up"
                    style={{ animationDelay: "300ms" }}
                >
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Priorité élevée</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.highPriority}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtres
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les types</SelectItem>
                                <SelectItem value="shipping">Expédition</SelectItem>
                                <SelectItem value="payment">Paiement</SelectItem>
                                <SelectItem value="system">Système</SelectItem>
                                <SelectItem value="promotion">Promotion</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="unread">Non lues</SelectItem>
                                <SelectItem value="read">Lues</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Priorité" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les priorités</SelectItem>
                                <SelectItem value="high">Élevée</SelectItem>
                                <SelectItem value="medium">Moyenne</SelectItem>
                                <SelectItem value="low">Faible</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Notifications ({filteredNotifications.length})
                    </h3>
                </div>

                {filteredNotifications.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Aucune notification trouvée</h3>
                            <p className="text-gray-500 dark:text-gray-400">Essayez de modifier vos filtres de recherche</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredNotifications.map((notification, index) => {
                        const typeInfo = typeConfig[notification.type]
                        const priorityInfo = priorityConfig[notification.priority]
                        const TypeIcon = typeInfo.icon

                        return (
                            <Card
                                key={notification.id}
                                className={`transition-all duration-300 hover:shadow-lg animate-slide-up ${!notification.read ? "border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/10" : ""
                                    }`}
                                style={{ animationDelay: `${500 + index * 50}ms` }}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2 ${typeInfo.bgColor} rounded-lg flex-shrink-0`}>
                                            <TypeIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3
                                                        className={`font-semibold ${!notification.read
                                                            ? "text-gray-900 dark:text-gray-100"
                                                            : "text-gray-700 dark:text-gray-300"
                                                            }`}
                                                    >
                                                        {notification.title}
                                                    </h3>
                                                    <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                                                    <Badge className={priorityInfo.color}>{priorityInfo.label}</Badge>
                                                    {!notification.read && <Badge className="bg-blue-100 text-blue-800">Nouveau</Badge>}
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDate(notification.date)}
                                                    </span>
                                                </div>
                                            </div>
                                            <p
                                                className={`text-sm mb-4 ${!notification.read ? "text-gray-700 dark:text-gray-300" : "text-gray-600 dark:text-gray-400"
                                                    }`}
                                            >
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {notification.actionUrl && (
                                                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                                                        <Eye className="h-4 w-4" />
                                                        Voir détails
                                                    </Button>
                                                )}
                                                {!notification.read ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="gap-1"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                        Marquer comme lu
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => markAsUnread(notification.id)}
                                                        className="gap-1"
                                                    >
                                                        <MarkAsUnread className="h-4 w-4" />
                                                        Marquer comme non lu
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Supprimer
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
