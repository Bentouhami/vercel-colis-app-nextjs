// path: src/components/forms/admins/AgencyForm.tsx

import React from 'react';
import { AgencyDto } from '@/services/dtos/agencies/AgencyDto';

interface AgencyFormProps {
    agency: AgencyDto;
    onSubmit: (agency: AgencyDto) => void;
}

const AgencyForm = () => {
    return (
        <div className="flex flex-col gap-4 bg-dark p-4">
            <h2>Agency Form</h2>
        </div>
    );
};

export default AgencyForm;