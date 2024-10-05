// path: src/components/navigations/dashboard/DashboardNavbar.tsx

'use client';

import Link from "next/link";
import React from "react";

export default function DashboardNavbar() {
    return (
        <nav className="dashboard-navbar bg-dark text-white p-4">
            <ul className="nav-list flex">
                <li className="nav-item me-4">
                    <Link href="/dashboard">Dashboard Overview</Link>
                </li>
                <li className="nav-item me-4">
                    <Link href="/dashboard/customers">Customers</Link>
                </li>
                <li className="nav-item">
                    <Link href="/dashboard/invoices">Invoices</Link>
                </li>
            </ul>
        </nav>
    );
}
