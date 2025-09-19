import { NextRequest, NextResponse } from "next/server";
import {
  getPaymentSuccessDataById,
  updateEnvoi,
} from "@/services/backend-services/Bk_EnvoiService";
import { prisma } from "@/utils/db";
import nodemailer from "nodemailer";
import { DOMAIN } from "@/utils/constants";

/**
 * Update an envoi
 * @param req
 * @param props
 * @returns
 */
export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  try {
    const envoiId = parseInt(params.id, 10);
    if (isNaN(envoiId)) {
      return NextResponse.json(
        { error: "Invalid envoi ID provided." },
        { status: 400 }
      );
    }

    // Update envoi in the database (generates tracking, marks paid, etc.)
    const updateOk = await updateEnvoi(envoiId);
    if (!updateOk) {
      return NextResponse.json({ error: "Envoi not found." }, { status: 404 });
    }

    // Fetch latest envoi with client details
    const updatedEnvoi = await prisma.envoi.findUnique({
      where: { id: envoiId },
      select: {
        client: { select: { email: true } },
        destinataire: { select: { email: true } },
        id: true,
        totalPrice: true,
        trackingNumber: true,
      },
    });
    if (!updatedEnvoi) {
      return NextResponse.json(
        { error: "Envoi not found after update." },
        { status: 404 }
      );
    }

    // Upsert a payment record and send confirmation/tracking emails
    try {
      // Persist payment row as PAID
      await prisma.payment.upsert({
        where: { envoiId: envoiId },
        update: {
          status: "PAID",
          amount: updatedEnvoi.totalPrice ?? 0,
        },
        create: {
          envoiId: envoiId,
          method: "CARD",
          status: "PAID",
          amount: updatedEnvoi.totalPrice ?? 0,
        },
      });

      // Notify both sender and recipient when emails exist
      const clientEmail = updatedEnvoi.client?.email ?? null;
      const destinataireEmail = updatedEnvoi.destinataire?.email ?? null;

      if (clientEmail || destinataireEmail) {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT),
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        const trackingUrl = updatedEnvoi.trackingNumber
          ? `${DOMAIN}/client/tracking/${encodeURIComponent(
              updatedEnvoi.trackingNumber
            )}`
          : "";

        if (clientEmail) {
          const clientHtml = `
            <!doctype html>
            <html lang="fr">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Confirmation de paiement - ColisApp</title>
              <!--[if mso]>
              <noscript>
                <xml>
                  <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                  </o:OfficeDocumentSettings>
                </xml>
              </noscript>
              <![endif]-->
            </head>
            <body style="margin:0;padding:0;background-color:#f5f7fa;font-family:Arial,Helvetica,sans-serif;line-height:1.6;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
              
              <!-- Wrapper Table -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f5f7fa;">
                <tr>
                  <td align="center" style="padding:20px 0;">
                    
                    <!-- Main Container -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;" class="email-container">
                      
                      <!-- Header -->
                      <tr>
                        <td style="background-color:#667eea;padding:32px;text-align:center;">
                          <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0;font-family:Arial,Helvetica,sans-serif;">ColisApp</h1>
                          <p style="color:rgba(255,255,255,0.9);font-size:14px;margin:8px 0 0 0;font-weight:400;">Votre solution d'expédition de confiance</p>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding:40px 32px;">
                          
                          <!-- Success Icon -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td align="center" style="padding-bottom:24px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                  <tr>
                                    <td style="width:64px;height:64px;background-color:#10b981;border-radius:32px;text-align:center;vertical-align:middle;">
                                      <span style="color:white;font-size:32px;font-weight:bold;line-height:64px;">✓</span>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Main Message -->
                          <h2 style="color:#1f2937;font-size:24px;font-weight:700;margin:0 0 16px 0;text-align:center;line-height:1.3;font-family:Arial,Helvetica,sans-serif;">Paiement confirmé avec succès !</h2>
                          
                          <p style="color:#6b7280;font-size:16px;text-align:center;margin:0 0 32px 0;line-height:1.6;">
                            Votre paiement pour l'envoi <strong>#${
                              updatedEnvoi.id
                            }</strong> a été traité avec succès. 
                            Votre colis sera pris en charge dans les plus brefs délais.
                          </p>
                          
                          <!-- Payment Details -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f9fafb;border:1px solid #e5e7eb;margin:24px 0;">
                            <tr>
                              <td style="padding:24px;">
                                
                                <!-- Section Title -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td style="padding-bottom:16px;">
                                      <h3 style="color:#374151;font-size:16px;font-weight:600;margin:0;font-family:Arial,Helvetica,sans-serif;">
                                        💳 Détails du paiement
                                      </h3>
                                    </td>
                                  </tr>
                                </table>
                                
                                <!-- Detail Rows -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                          <td style="color:#6b7280;font-size:14px;font-weight:500;">Numéro d'envoi</td>
                                          <td align="right" style="color:#1f2937;font-size:14px;font-weight:600;">#${
                                            updatedEnvoi.id
                                          }</td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                  
                                  <tr>
                                    <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                          <td style="color:#6b7280;font-size:14px;font-weight:500;">Montant payé</td>
                                          <td align="right" style="color:#059669;font-size:16px;font-weight:700;">${(
                                            updatedEnvoi.totalPrice ?? 0
                                          ).toFixed(2)} €</td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                  
                                  <tr>
                                    <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                          <td style="color:#6b7280;font-size:14px;font-weight:500;">Statut du paiement</td>
                                          <td align="right">
                                            <span style="background-color:#d1fae5;color:#065f46;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;text-transform:uppercase;">Payé</span>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                  
                                  ${
                                    updatedEnvoi.trackingNumber
                                      ? `
                                  <tr>
                                    <td style="padding:12px 0 0 0;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                          <td style="color:#6b7280;font-size:14px;font-weight:500;">Numéro de suivi</td>
                                          <td align="right" style="color:#1f2937;font-size:14px;font-weight:600;word-break:break-all;">${updatedEnvoi.trackingNumber}</td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                  `
                                      : ""
                                  }
                                </table>
                                
                              </td>
                            </tr>
                          </table>
                          
                          ${
                            updatedEnvoi.trackingNumber
                              ? `
                          <!-- Tracking Button -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td align="center" style="padding:32px 0;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                  <tr>
                                    <td style="background-color:#3b82f6;border-radius:8px;">
                                      <a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;font-family:Arial,Helvetica,sans-serif;">
                                        📦 Suivre mon colis
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                          `
                              : ""
                          }
                          
                          <!-- Info Section -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#fef3c7;border-left:4px solid #f59e0b;margin:24px 0;">
                            <tr>
                              <td style="padding:16px 20px;">
                                <p style="color:#92400e;font-size:14px;margin:0;line-height:1.5;">
                                  <strong>💡 Bon à savoir :</strong> Vous pouvez retrouver tous les détails de cette commande 
                                  et suivre son évolution à tout moment dans votre espace client ColisApp.
                                </p>
                              </td>
                            </tr>
                          </table>
                          
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="background-color:#f9fafb;padding:32px;text-align:center;border-top:1px solid #e5e7eb;">
                          <p style="color:#6b7280;font-size:13px;margin:0 0 8px 0;line-height:1.5;">
                            Cet e-mail a été envoyé automatiquement. Merci de ne pas y répondre directement.<br>
                            Pour toute question, contactez notre service client.
                          </p>
                          <p style="color:#9ca3af;font-size:12px;margin:0;">
                            © ${new Date().getFullYear()} ColisApp - Tous droits réservés
                          </p>
                        </td>
                      </tr>
                      
                    </table>
                    
                  </td>
                </tr>
              </table>
              
              <style>
                @media only screen and (max-width: 600px) {
                  .email-container {
                    width: 100% !important;
                    max-width: 100% !important;
                  }
                  
                  .email-container td {
                    padding-left: 20px !important;
                    padding-right: 20px !important;
                  }
                }
              </style>
              
            </body>
            </html>`;

          await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: clientEmail,
            subject: `Confirmation de paiement - Envoi #${updatedEnvoi.id}`,
            html: clientHtml,
          });
        }

        if (destinataireEmail) {
          const trackingDetails = updatedEnvoi.trackingNumber
            ? `
              <p style="margin:0 0 16px 0;color:#1f2937;font-size:16px;font-weight:500;">
                Numéro de suivi : <strong>${updatedEnvoi.trackingNumber}</strong>
              </p>
            `
            : `
              <p style="margin:0 0 16px 0;color:#1f2937;font-size:16px;font-weight:500;">
                Le numéro de suivi sera communiqué dès que disponible.
              </p>
            `;

          const trackingButton = updatedEnvoi.trackingNumber
            ? `
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:24px 0;">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="background-color:#2563eb;border-radius:8px;">
                          <a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 28px;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;font-family:Arial,Helvetica,sans-serif;">
                            🔍 Suivre le colis
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            `
            : "";

          const destinataireHtml = `
            <!doctype html>
            <html lang="fr">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Informations d'expédition - ColisApp</title>
            </head>
            <body style="margin:0;padding:0;background-color:#f9fafb;font-family:Arial,Helvetica,sans-serif;line-height:1.6;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f9fafb;">
                <tr>
                  <td align="center" style="padding:24px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:14px;overflow:hidden;">
                      <tr>
                        <td style="background-color:#1d4ed8;padding:28px;text-align:center;color:#ffffff;">
                          <h1 style="margin:0;font-size:24px;font-weight:700;">Votre colis est en préparation</h1>
                          <p style="margin:8px 0 0 0;font-size:14px;color:rgba(255,255,255,0.9);">
                            Référence d'envoi #${updatedEnvoi.id}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:32px;color:#1f2937;">
                          <p style="margin:0 0 18px 0;font-size:16px;">
                            Bonjour,
                          </p>
                          <p style="margin:0 0 18px 0;font-size:16px;">
                            Vous êtes destinataire d'un colis expédié via ColisApp. Voici les informations utiles pour suivre son acheminement :
                          </p>
                          ${trackingDetails}
                          ${trackingButton}
                          <p style="margin:24px 0 0 0;font-size:14px;color:#4b5563;">
                            Conservez ce message pour accéder facilement au suivi de votre colis. Nous vous informerons automatiquement en cas de mise à jour importante.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color:#f3f4f6;padding:24px;text-align:center;font-size:12px;color:#6b7280;">
                          <p style="margin:0 0 6px 0;">Cet e-mail est généré automatiquement par ColisApp.</p>
                          <p style="margin:0;">© ${new Date().getFullYear()} ColisApp - Tous droits réservés</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>`;

          await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: destinataireEmail,
            subject: `Suivi de votre colis - Référence #${updatedEnvoi.id}`,
            html: destinataireHtml,
          });
        }
      }
    } catch (e) {
      console.error("Post-update payment/email step failed", e);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating envoi:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

/**
 * Get an envoi by id
 * @param req
 * @param props
 */
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  try {
    const envoiId = parseInt(params.id, 10);
    if (!envoiId || isNaN(envoiId)) {
      return NextResponse.json(
        { error: "Invalid envoi ID provided." },
        { status: 400 }
      );
    }

    // Get envoi from the database
    const envoi = await getPaymentSuccessDataById(envoiId);
    if (!envoi) {
      return NextResponse.json({ error: "Envoi not found." }, { status: 404 });
    }

    return NextResponse.json(envoi, { status: 200 });
  } catch (error) {
    console.error("Error getting envoi:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
