// path: src/app/client/(user)/register/page.tsx

import RegisterPageClient from "@/components/auth/register/RegisterPageClient";


// path: src/app/auth/login/page.tsx
export const dynamic = "force-dynamic";
export const runtime = "nodejs";


export default function RegisterPage() {
    return <RegisterPageClient />;
}
