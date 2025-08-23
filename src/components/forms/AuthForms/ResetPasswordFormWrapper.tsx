// path: src/components/forms/AuthForms/ResetPasswordFormWrapper.tsx
'use client'

import { Suspense } from 'react'
import ResetPasswordForm from './ResetPasswordForm'

export default function ResetPasswordFormWrapper() {
    return (
        <Suspense fallback={<div className="text-center p-8">Chargement...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}
