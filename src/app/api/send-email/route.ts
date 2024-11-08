import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {DOMAIN} from "@/utils/constants";


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

export async function POST(req: NextRequest) {
    const { name, email, token } = await req.json();
    const verificationUrl = `${DOMAIN}/client/verify-email?token=${token}`;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Welcome to ColisApp - Verify Your Email Address',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verify Your Email - ColisApp</title>
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
                        <!-- Logo and Header -->
                        <div style="
                            text-align: center;
                            margin-bottom: 30px;
                            padding: 20px;
                        ">
                            <h1 style="
                                color: #1a73e8;
                                margin: 0;
                                font-size: 28px;
                                font-weight: bold;
                            ">ColisApp</h1>
                        </div>

                        <!-- Main Content Card -->
                        <div style="
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            padding: 40px 30px;
                            margin-bottom: 20px;
                        ">
                            <h2 style="
                                margin: 0 0 20px;
                                color: #333333;
                                font-size: 24px;
                                font-weight: bold;
                                text-align: center;
                            ">Welcome to ColisApp, ${name}!</h2>

                            <p style="
                                color: #666666;
                                font-size: 16px;
                                margin-bottom: 25px;
                                text-align: center;
                            ">Thank you for joining ColisApp. To get started, please verify your email address.</p>

                            <!-- Verification Button -->
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${verificationUrl}" style="
                                    background-color: #1a73e8;
                                    color: #ffffff;
                                    padding: 12px 30px;
                                    border-radius: 4px;
                                    text-decoration: none;
                                    font-weight: bold;
                                    display: inline-block;
                                    text-align: center;
                                    font-size: 16px;
                                ">Verify Email Address</a>
                            </div>

                            <!-- Time Notice -->
                            <p style="
                                color: #666666;
                                font-size: 14px;
                                margin-top: 25px;
                                text-align: center;
                                font-style: italic;
                            ">This verification link will expire in 15 minutes.</p>

                            <!-- Alternative Link -->
                            <div style="
                                margin-top: 25px;
                                padding: 15px;
                                background-color: #f8f9fa;
                                border-radius: 4px;
                            ">
                                <p style="
                                    color: #666666;
                                    font-size: 14px;
                                    margin: 0 0 10px;
                                ">If the button doesn't work, copy and paste this link into your browser:</p>
                                <p style="
                                    color: #1a73e8;
                                    font-size: 14px;
                                    margin: 0;
                                    word-break: break-all;
                                ">${verificationUrl}</p>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="
                            text-align: center;
                            color: #666666;
                            font-size: 12px;
                            margin-top: 20px;
                        ">
                            <p style="margin: 5px 0;">
                                This email was sent by ColisApp
                            </p>
                            <p style="margin: 5px 0;">
                                If you didn't create this account, please ignore this email.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        return NextResponse.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending verification email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}