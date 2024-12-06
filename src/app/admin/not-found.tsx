// Path: src/app/admin/not-found.tsx

import NotFound from '@/components/NotFound';

export default function AdminNotFound() {
    return (
        <NotFound
            redirectPath="/admin" // Redirect to the admin section
            message="Cette page dans la section administrateur n'existe pas."
            countdownSeconds={5} // Customize countdown duration
        />
    );
}
