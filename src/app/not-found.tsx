// path: src/app/not-found.tsx
import NotFound from '@/components/not-found';

export default function ClientNotFound() {
    return (
        <NotFound
            redirectPath="/client" // Redirect to the client section
            message="Cette page n'existe pas."
            countdownSeconds={5} // Customize countdown duration
        />
    );
}