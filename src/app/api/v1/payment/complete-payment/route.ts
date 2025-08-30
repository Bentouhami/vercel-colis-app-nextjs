// Path: src/app/api/v1/payment/complete-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { completePaymentService } from "@/services/frontend-services/payment/paymentService";
import {
  getSimulationById,
  updatePaidEnvoi,
} from "@/services/backend-services/Bk_SimulationService";
import { verifySimulationToken } from "@/utils/verifySimulationToken";
import { EnvoiStatusDto, SimulationStatusDto } from "@/services/dtos";
import nodemailer from "nodemailer";
import { prisma } from "@/utils/db";
import { DOMAIN } from "@/utils/constants";

/**
 * Complete payment process
 * @description Finalizes the payment process after redirection from the payment gateway. Updates envoi status and deletes the simulation cookie.
 * @response 200:{ message: string }:Payment completed successfully
 * @response 500:{ message: string }:Payment error
 * @openapi
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Retrieve Simulation Data from Cookie
    const simulationFromCookie = verifySimulationToken(req);

    if (!simulationFromCookie) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    let simulation = await getSimulationById(Number(simulationFromCookie.id));

    if (!simulation) {
      return NextResponse.json({ data: null }, { status: 200 });
    }
    // 2. Update Simulation Status to COMPLETED and STATUS to PENDING and PAID to TRUE
    simulation =
      simulation.simulationStatus === SimulationStatusDto.CONFIRMED
        ? {
            ...simulation,
            simulationStatus: SimulationStatusDto.COMPLETED,
            envoiStatus: EnvoiStatusDto.PENDING,
          }
        : simulation;

    if (!simulation) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    // Update Simulation envoi status and simulationStatus
    await updatePaidEnvoi(simulation, simulationFromCookie);

    await completePaymentService();

    // Persist Payment record as PAID and send emails (if possible)
    try {
      const envoiId = Number(simulationFromCookie.id);
      const envoi = await prisma.envoi.findUnique({
        where: { id: envoiId },
        include: { client: true },
      });

      if (envoi?.client?.email) {
        // Upsert payment for this envoi
        // Note: schema enforces unique envoiId on payments
        await prisma.payment.upsert({
          where: { envoiId: envoiId },
          update: {
            status: "PAID",
            amount: envoi.totalPrice ?? 0,
          },
          create: {
            envoiId: envoiId,
            method: "CARD",
            status: "PAID",
            amount: envoi.totalPrice ?? 0,
          },
        });

        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT),
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        // Single combined email: confirmation + tracking (if available)
        const trackingUrl = envoi.trackingNumber
          ? `${DOMAIN}/client/tracking/${encodeURIComponent(envoi.trackingNumber)}`
          : '';

        const html = `
          <!doctype html>
          <html lang="fr">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Confirmation de paiement</title>
            <style>
              .container{max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
              .header{background:#0f172a;padding:20px 24px;color:#fff}
              .brand{font-size:20px;font-weight:700;margin:0}
              .content{padding:24px 24px 8px 24px;color:#0f172a;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6}
              .muted{color:#64748b}
              .section{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin:16px 0}
              .row{display:flex;justify-content:space-between;margin:4px 0;color:#0f172a}
              .label{color:#64748b}
              .btn{display:inline-block;background:#1a73e8;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;font-weight:600}
              .footer{padding:16px 24px 24px 24px;color:#64748b;font-size:12px}
            </style>
          </head>
          <body style="background:#eef2f7;padding:24px">
            <div class="container">
              <div class="header">
                <h1 class="brand">ColisApp</h1>
              </div>
              <div class="content">
                <h2 style="margin:0 0 8px">Paiement confirmé</h2>
                <p class="muted" style="margin:0 0 16px">Bonjour ${envoi.client.firstName ?? envoi.client.name ?? ''},</p>
                <p style="margin:0 0 8px">Votre paiement pour l'envoi <strong>#${envoi.id}</strong> a bien été confirmé.</p>
                <div class="section">
                  <div class="row"><span class="label">Montant</span><strong>${(envoi.totalPrice ?? 0).toFixed(2)} €</strong></div>
                  <div class="row"><span class="label">Statut</span><strong>Payé</strong></div>
                  ${envoi.trackingNumber ? `<div class="row"><span class="label">N° de suivi</span><strong>${envoi.trackingNumber}</strong></div>` : ''}
                </div>
                ${envoi.trackingNumber ? `<p style="margin:14px 0"><a class="btn" href="${trackingUrl}">Suivre mon colis</a></p>` : ''}
                <p class="muted" style="margin-top:24px">Vous pouvez retrouver ce récapitulatif dans votre espace client.</p>
              </div>
              <div class="footer">
                <p style="margin:0">Cet e-mail a été envoyé automatiquement, merci de ne pas y répondre.</p>
                <p style="margin:4px 0 0">© ${new Date().getFullYear()} ColisApp</p>
              </div>
            </div>
          </body>
          </html>`;

        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: envoi.client.email,
          subject: `Confirmation de paiement - Envoi #${envoi.id}`,
          html,
        });
      }
    } catch (e) {
      console.error("Payment email send failed", e);
    }

    const response = NextResponse.json({
      message: "Payment completed successfully",
    });

    // delete cookies of the simulation and redirect to the profile page
    const cookieName = process.env.SIMULATION_COOKIE_NAME;

    // Actually remove the cookie from the response
    response.cookies.set({
      name: "cookieName",
      value: "",
      path: "/",
      maxAge: 0,
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Erreur lors de la création de la session Stripe:", error);
    return new NextResponse("Erreur de paiement", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
