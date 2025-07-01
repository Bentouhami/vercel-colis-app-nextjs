// path : /src/app/dashboard/customers/page.tsx => this is the customer's page component

import UsersList from "@/components/admin/collections/UsersList";

/**
 * This page is used to manage the customers of an agency
 */
function CustomersPage() {
    return (
        <UsersList />
    )
}

export default CustomersPage
