export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // ensure Node.js lambda on Vercel

import VerifyEmailClient from "@/components/auth/verify-email/VerifyEmailClient";

export default function Page() {
    return <VerifyEmailClient />;
}
