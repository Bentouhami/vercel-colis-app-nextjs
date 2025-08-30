import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, Shield, User } from "lucide-react"
import Link from "next/link"
import { auth } from "@/auth/auth"
import { RoleDto } from "@/services/dtos"

interface UnauthorizedPageProps {
  searchParams: Promise<{
    reason?: string
    attempted?: string
    role?: string
  }>
}

export default async function AdminUnauthorizedPage({ searchParams }: UnauthorizedPageProps) {
  const session = await auth()
  const { reason, attempted, role } = await searchParams

  const isAdmin =
    session?.user?.role &&
    [RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT].includes(session.user.role as RoleDto)
  const isClient = session?.user?.role && [RoleDto.CLIENT, RoleDto.DESTINATAIRE].includes(session.user.role as RoleDto)

  const getContextualMessage = () => {
    if (reason === "admin_restricted_access") {
      return {
        title: "Accès Restreint (Espace Admin)",
        description:
          "Votre rôle administrateur ne peut pas accéder à cette ressource en dehors de l'espace admin.",
        icon: Shield,
        color: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
      }
    } else if (reason === "client_blocked_from_admin") {
      return {
        title: "Accès Réservé à l'Administration",
        description: "Cette section est réservée aux administrateurs.",
        icon: User,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
      }
    } else {
      return {
        title: "Accès Non Autorisé",
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-900/20",
      }
    }
  }

  const contextualMessage = getContextualMessage()
  const IconComponent = contextualMessage.icon

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div
            className={`mx-auto w-16 h-16 ${contextualMessage.bgColor} rounded-full flex items-center justify-center mb-4`}
          >
            <IconComponent className={`w-8 h-8 ${contextualMessage.color}`} />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {contextualMessage.title}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {contextualMessage.description}
          </CardDescription>
          {attempted && (
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-600 dark:text-gray-400">
              Ressource: <code className="font-mono">{attempted}</code>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <Suspense fallback={<div>Chargement...</div>}>
            {session?.user ? (
              <div className="space-y-3">
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Connecté en tant que: <strong>{session.user.name}</strong>
                  {role && <span className="block text-xs mt-1">Rôle: {role}</span>}
                </div>

                {isAdmin ? (
                  <Button asChild className="w-full">
                    <Link href="/admin" className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Aller au Dashboard Admin
                    </Link>
                  </Button>
                ) : isClient ? (
                  <Button asChild className="w-full">
                    <Link href="/client" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Aller à l&apos;Espace Client
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/" className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Retour à l&apos;Accueil
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/auth/login" className="flex items-center gap-2">
                    Se Connecter
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Retour à l&apos;Accueil
                  </Link>
                </Button>
              </div>
            )}
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

