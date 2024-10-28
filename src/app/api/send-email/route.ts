// app/api/send-email/route.ts

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
    const { name, email, token } = await req.json();

    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/client/verify-email?token=${token}`;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Verify your email address',
            html: `<strong>${name}</strong> Welcome to ColisApp, and thank you for registering. Please click <a href="${verificationUrl}">here</a> to verify your email address. This link is active for 15 minutes.`,
        });

        return NextResponse.json({ message: 'Email sent successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
