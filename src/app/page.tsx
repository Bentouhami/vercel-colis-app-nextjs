// path : src/app/page.tsx

export default async function Home() {
    return (
        <div className="d-flex items-center justify-center h-screen space-x-8">
            {/* Bouton pour les clients */}
            {/*<h1 className="flex flex-col items-center justify-center text-center">*/}
            {/*    Bienvenue sur ColiSap*/}
            {/*    vous êtes un client ou un admin ?*/}
            {/*</h1>*/}
            <a
                className="group relative inline-flex items-center overflow-hidden rounded border border-current px-8 py-3 text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                href="/client"

            >
                <span className="absolute -start-full transition-all group-hover:start-4">
                    <svg
                        className="size-5 rtl:rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                    </svg>
                </span>
                <span className="text-sm font-medium transition-all group-hover:ms-4">
                    Je suis client
                </span>
            </a>

            {/* Bouton pour les super admins */}
            <a
                className="group relative inline-flex items-center overflow-hidden rounded bg-indigo-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"
                href="/admin/super-admin"
            >
                <span className="absolute -end-full transition-all group-hover:end-4">
                    <svg
                        className="size-5 rtl:rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                    </svg>
                </span>
                <span className="text-sm font-medium transition-all group-hover:me-4">
                    Je suis super admin
                </span>
            </a>

            {/* Bouton pour les agency admins */}
            {/* Bouton pour les admins */}
            <a
                className="group relative inline-flex items-center overflow-hidden rounded bg-indigo-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"
                href="/admin/agency-admin"
            >
                <span className="absolute -end-full transition-all group-hover:end-4">
                    <svg
                        className="size-5 rtl:rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                    </svg>
                </span>
                <span className="text-sm font-medium transition-all group-hover:me-4">
                    Je suis agency admin
                </span>
            </a>
        </div>
    )
}