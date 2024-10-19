// path: src/app/api/v1/destinataires/set-password/route.ts

import {hashPassword} from "@/lib/auth";
import prisma from "@/utils/db";


export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const { token, password } = req.body;

    const destinataire = await prisma.user.findFirst({
        where: { verificationToken: token },
    });

    if (!destinataire) {
        return res.status(400).json({ message: "Invalid token" });
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
        where: { id: destinataire.id },
        data: { password: hashedPassword, verificationToken: null },
    });

    res.status(200).json({ message: "Password set successfully." });
}
