// path: src/app/client/layout.tsx

import React from 'react'
import HeaderWrapper from "@/components/navigations/header/HeaderWrapper";

// import 'bootstrap/dist/css/bootstrap.min.css';


function Layout({children}: { children: React.ReactNode }) {
    return (
        <div>
            <HeaderWrapper/>
            <main>
                {children}
            </main>
        </div>
    )
}

export default Layout
