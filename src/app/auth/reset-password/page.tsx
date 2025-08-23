// path: src/app/auth/reset-password/page.tsx
export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // ensure Node.js lambda on Vercel

import ResetPasswordFormWrapper from '@/components/forms/AuthForms/ResetPasswordFormWrapper'

export default function ResetPasswordPage() {
    return <ResetPasswordFormWrapper />
}


