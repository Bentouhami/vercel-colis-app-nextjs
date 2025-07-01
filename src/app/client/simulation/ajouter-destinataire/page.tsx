// path: src/app/client/ajouter-destinataire/page.tsx
'use server';

import AddReceiverForm from "@/components/forms/EnvoiForms/AddReceiverForm";

function AddReceiverPage() {
    return (

        <div className={'container'}>
            <AddReceiverForm/>
        </div>
    )
}

export default AddReceiverPage
