import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

export async function POST(req: NextRequest) {
    const { name, email, phone, subject, message } = await req.json();
    const currentDate = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    try {
        await transporter.sendMail({
            from: email,
            to: process.env.MY_CONTACT_EMAIL,
            subject: `Contact: ${subject}`,
            html: `
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Nouveau message de contact</title>
                </head>
                <body style="
                    margin: 0;
                    padding: 0;
                    background-color: #f6f9fc;
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                ">
                    <div style="
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    ">
                        <div style="
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            padding: 30px;
                            margin-bottom: 20px;
                        ">
                            <div style="
                                border-bottom: 2px solid #f0f0f0;
                                padding-bottom: 20px;
                                margin-bottom: 20px;
                            ">
                                <h1 style="
                                    color: #1a73e8;
                                    margin: 0;
                                    font-size: 24px;
                                    font-weight: bold;
                                ">Nouveau message de contact</h1>
                                <p style="
                                    color: #666666;
                                    margin: 10px 0 0;
                                    font-size: 14px;
                                ">Reçu le ${currentDate}</p>
                            </div>

                            <div style="margin-bottom: 25px;">
                                <div style="margin-bottom: 15px;">
                                    <label style="
                                        display: block;
                                        color: #666666;
                                        font-size: 12px;
                                        text-transform: uppercase;
                                        margin-bottom: 5px;
                                    ">Expéditeur</label>
                                    <p style="
                                        margin: 0;
                                        font-size: 16px;
                                        font-weight: 500;
                                    ">${name}</p>
                                </div>

                                <div style="margin-bottom: 15px;">
                                    <label style="
                                        display: block;
                                        color: #666666;
                                        font-size: 12px;
                                        text-transform: uppercase;
                                        margin-bottom: 5px;
                                    ">Email</label>
                                    <p style="
                                        margin: 0;
                                        font-size: 16px;
                                        color: #1a73e8;
                                    ">${email}</p>
                                </div>

                                <div style="margin-bottom: 15px;">
                                    <label style="
                                        display: block;
                                        color: #666666;
                                        font-size: 12px;
                                        text-transform: uppercase;
                                        margin-bottom: 5px;
                                    ">Téléphone</label>
                                    <p style="
                                        margin: 0;
                                        font-size: 16px;
                                    ">${phone || 'Non fourni'}</p>
                                </div>

                                <div style="margin-bottom: 15px;">
                                    <label style="
                                        display: block;
                                        color: #666666;
                                        font-size: 12px;
                                        text-transform: uppercase;
                                        margin-bottom: 5px;
                                    ">Sujet</label>
                                    <p style="
                                        margin: 0;
                                        font-size: 16px;
                                        font-weight: 500;
                                    ">${subject}</p>
                                </div>
                            </div>

                            <div style="
                                background-color: #f8f9fa;
                                border-radius: 4px;
                                padding: 20px;
                            ">
                                <label style="
                                    display: block;
                                    color: #666666;
                                    font-size: 12px;
                                    text-transform: uppercase;
                                    margin-bottom: 10px;
                                ">Message</label>
                                <div style="
                                    white-space: pre-wrap;
                                    font-size: 15px;
                                    line-height: 1.6;
                                ">${message}</div>
                            </div>
                        </div>

                        <div style="
                            text-align: center;
                            font-size: 12px;
                            color: #666666;
                        ">
                            <p>Cet email a été envoyé via le formulaire de contact de votre site web.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        return NextResponse.json({ message: 'Message envoyé avec succès' });
    } catch (error) {
        console.error("Erreur lors de l'envoi du message de contact:", error);
        return NextResponse.json({ error: "Échec de l'envoi du message" }, { status: 500 });
    }
}