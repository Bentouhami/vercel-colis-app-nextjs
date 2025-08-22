import NotFound from "@/components/not-found"

export default function ClientNotFound() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-fade-in">
            <NotFound redirectPath="/client" message="Cette page dans la section client n'existe pas." countdownSeconds={5} />
        </div>
    )
}
