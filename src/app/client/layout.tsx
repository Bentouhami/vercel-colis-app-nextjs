// path: src/app/client/layout.tsx

import React from 'react'
import HeaderWrapper from "@/components/navigations/header/HeaderWrapper";
import Footer from "@/components/navigations/footer/Footer";
// import 'bootstrap/dist/css/bootstrap.min.css';


function Layout({children}: {children: React.ReactNode}) {
    return (
        <div>
            {/*<HeaderWrapper />*/}
            <HeaderWrapper/>
            <main>
                {children}
            </main>
            <Footer/>
        </div>
    )
}

export default Layout
