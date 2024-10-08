// path: components/forms/AboutForm.tsx => this is the about form component that is used in the about page

'use client';

import {FormEvent, useState} from "react";
import {toast} from "react-toastify";

function AboutForm() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    // function to handle form submission event
    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const messageBody = {
            name,
            email,
            phone,
            message,
        };
        console.log(messageBody);

        // TODO: Send message to server
        // axios.post('/api/v1/contact-us', messageBody)
        //     .then(response => {
        //         console.log(response);
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     });

        // TODO: Display success message
        toast.success("Message envoyé avec succès");
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
    }

    return (
    <section className="bg-gray-100">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
                <div className="lg:col-span-2 lg:py-12">
                    <p className="max-w-xl text-lg">
                        At the same time, the fact that we are wholly owned and totally independent from
                        manufacturer and other group control gives you confidence that we will only recommend what
                        is right for you.
                    </p>

                    <div className="mt-8">
                        <a href="#" className="text-2xl font-bold text-pink-600"> +32 xxx xxx xxx </a>

                        <address className="mt-2 not-italic">Adresse de l&apos;entreprise : Rue xxx, 12345 Ville, Code Postal</address>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="sr-only" htmlFor="name">Nom</label>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-lg border-gray-200 p-3 text-sm border-2"
                                placeholder="Name"
                                type="text"
                                id="name"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="sr-only" htmlFor="email">Email</label>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-lg border-gray-200 p-3 text-sm border-2"
                                    placeholder="Email address"
                                    type="email"
                                    id="email"
                                />
                            </div>

                            <div>
                                <label className="sr-only" htmlFor="phone">Téléphone</label>
                                <input
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full rounded-lg border-gray-200 p-3 text-sm border-2"
                                    placeholder="Phone Number"
                                    type="tel"
                                    id="phone"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="sr-only" htmlFor="message">Message</label>

                            <textarea
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full rounded-lg border-gray-200 p-3 text-sm border-2"
                                placeholder="Message"
                                rows={8}
                                id="message"
                            ></textarea>
                        </div>

                        <div className="mt-4">
                            <button
                                type="submit"
                                className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
    )
}

export default AboutForm
