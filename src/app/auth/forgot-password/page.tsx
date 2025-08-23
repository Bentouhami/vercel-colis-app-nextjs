// path: src/app/client/auth/forgot-password/page.tsx
export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // ensure Node.js lambda on Vercel

import ForgotPasswordForm from "@/components/forms/AuthForms/ForgotPasswordForm"

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm />
}
