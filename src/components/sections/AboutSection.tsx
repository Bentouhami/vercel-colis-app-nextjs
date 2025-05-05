// src/components/sections/AboutSection.tsx
export default function AboutSection() {
    return (
        <section id="about" className="py-20 bg-white">
            <div className="container px-4 md:px-6 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
                    À propos de ColisApp
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed text-center">
                    ColisApp est une plateforme moderne permettant aux particuliers et aux agences
                    d’envoyer facilement des colis entre la Belgique et le Maroc. Conçue dans le cadre d’un projet de fin d&#39;études, elle vise à offrir une expérience simple, intuitive et professionnelle.
                    <br /><br />
                    Notre mission est de **faciliter les envois internationaux** avec un système de simulation, de suivi et de gestion des envois depuis n&#39;importe où, en toute sécurité.
                </p>
            </div>
        </section>
    )
}
