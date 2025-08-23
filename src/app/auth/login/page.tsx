
// src/app/auth/login/page.tsx

import LoginPageClient from "@/components/auth/login/LoginPageClient";




// path: src/app/auth/login/page.tsx
export const dynamic = "force-dynamic";
export const runtime = "nodejs";


export default function Page() {
    return <LoginPageClient />;
}
