// path: src/app/client/contact-us/page.tsx

import ContactComponent from "@/components/conatct-us/ContactComponent";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contactez-nous',
}

const AboutPage = () => {
    return (
        <div>
            <ContactComponent/>
        </div>
    )
}
export default AboutPage
