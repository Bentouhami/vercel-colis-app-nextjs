$ErrorActionPreference = 'Stop'

function Add-Heading {
  Param([object]$Doc,[string]$Text,[int]$Level=1)
  $p = $Doc.Paragraphs.Add()
  $p.Range.Text = $Text
  $style = if ($Level -le 1) { 'Heading 1' } elseif ($Level -eq 2) { 'Heading 2' } else { 'Heading 3' }
  $p.Range.Style = $style
  $p.Range.InsertParagraphAfter() | Out-Null
}

function Add-Paragraph {
  Param([object]$Doc,[string]$Text)
  $p = $Doc.Paragraphs.Add()
  $p.Range.Text = $Text
  $p.Range.Style = 'Normal'
  $p.Range.ParagraphFormat.SpaceAfter = 6
  $p.Range.InsertParagraphAfter() | Out-Null
}

function Add-Bullets {
  Param([object]$Doc,[string[]]$Items)
  if (-not $Items -or $Items.Count -eq 0) { return }
  $p = $Doc.Paragraphs.Add()
  $p.Range.Text = ($Items -join "`r`n")
  $p.Range.ListFormat.ApplyBulletDefault() | Out-Null
  $p.Range.InsertParagraphAfter() | Out-Null
}

Write-Host 'Ouverture de Microsoft Word…'
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()

# Title
$t0 = @'
ColisApp est une plateforme web permettant aux particuliers et aux agences de simuler, créer, payer et suivre des envois de colis entre la Belgique et le Maroc. Le projet vise un parcours unifié, sécurisé et transparent, depuis la simulation de prix jusqu’au suivi post‑paiement.
'@
Add-Heading -Doc $doc -Text 'Résumé complet du TFE — ColisApp' -Level 1
Add-Paragraph -Doc $doc -Text $t0

# Contexte & Motivation
Add-Heading -Doc $doc -Text 'Contexte et motivation' -Level 2
$t1 = @'
Le marché présente des processus fragmentés (simulation, création, paiement, suivi) et une opacité des coûts. ColisApp répond à ces enjeux en centralisant les étapes critiques, en améliorant la traçabilité et en renforçant la confiance entre agences et clients.
'@
Add-Paragraph -Doc $doc -Text $t1

# Problématique
Add-Heading -Doc $doc -Text 'Problématique' -Level 2
Add-Bullets -Doc $doc -Items @(
  "Comment garantir un parcours continu: simuler → créer → payer → suivre ?",
  "Comment sécuriser les données et les paiements tout en restant ergonomique ?",
  "Comment gérer des rôles multi‑agences et assurer la scalabilité ?"
)

# Objectifs & Périmètre
Add-Heading -Doc $doc -Text 'Objectifs et périmètre' -Level 2
Add-Bullets -Doc $doc -Items @(
  "Fonctionnels: simulation des coûts, création d’envoi, paiement (Stripe, mode test), suivi par numéro, administration multi‑agences.",
  "Non‑fonctionnels: sécurité (Auth.js, RBAC), performance, maintenabilité, DX.",
  "KPIs ciblés: parcours < 5 minutes, taux d’erreur de paiement minimal, traçabilité complète."
)

# Démarche
Add-Heading -Doc $doc -Text 'Démarche méthodologique' -Level 2
$t2 = @'
Une démarche itérative a été adoptée: analyse (UML, MCD, OpenAPI), conception (architecture Next.js 15 + Prisma), implémentation (composants shadcn/Tailwind, validations Zod), puis validation et documentation. Les artefacts sont disponibles dans le dossier analyses (UML, architecture, endpoints, RGPD/RBAC).
'@
Add-Paragraph -Doc $doc -Text $t2

# Architecture & Technologies
Add-Heading -Doc $doc -Text 'Architecture et technologies' -Level 2
Add-Bullets -Doc $doc -Items @(
  "Frontend + API: Next.js 15 (App Router, API routes).",
  "Données: Prisma ORM + PostgreSQL (migrations Prisma).",
  "Sécurité: Auth.js (email/Google), RBAC (CLIENT, AGENCY_ADMIN, SUPER_ADMIN).",
  "Paiement: Stripe (mode test). Médias: Cloudinary.",
  "UI: TypeScript, Tailwind v4, shadcn UI.",
  "Infra locale: Docker + Nginx; variables via .env (voir docker-compose.yml)."
)

# Modèle & Flux
Add-Heading -Doc $doc -Text 'Modèle de données et flux métier' -Level 2
$t3 = @'
Entités clés: User, Agency, Parcel/Envoi, Payment, Appointment, Notification. La traçabilité s’appuie sur un numéro de suivi et des statuts d’envoi. Les flux couvrent la simulation, la création d’envoi, le paiement, et la consultation de suivi.
'@
Add-Paragraph -Doc $doc -Text $t3

# API & Sécurité
Add-Heading -Doc $doc -Text 'API, validation et sécurité (RGPD)' -Level 2
$t4 = @'
L’API v1 expose des endpoints pour utilisateurs, envois, tracking, paiement, agences. La documentation est disponible via Swagger (route swagger). Les entrées sont validées via Zod côté serveur; les secrets sont gérés par .env/CI et ne sont jamais commités. Les contrôles d’accès s’appuient sur les rôles et les middlewares applicatifs.
'@
Add-Paragraph -Doc $doc -Text $t4

# Fonctionnalités principales
Add-Heading -Doc $doc -Text 'Fonctionnalités principales réalisées' -Level 2
Add-Bullets -Doc $doc -Items @(
  "Authentification sécurisée (email + Google).",
  "Simulation des tarifs sans inscription.",
  "Création et gestion des envois, destinataires et historique.",
  "Paiement Stripe (test) et écriture des statuts post‑paiement.",
  "Suivi par numéro de tracking.",
  "Administration multi‑agences avec rôles et tableaux de bord.",
  "Notifications email (Nodemailer) et amélioration UX (skeletons, toasts)."
)

# Résultats & Évaluation
Add-Heading -Doc $doc -Text 'Résultats et évaluation' -Level 2
$t5 = @'
Le parcours utilisateur est fluide et cohérent; l’architecture modulaire facilite l’évolution. Les performances en développement sont satisfaisantes (Turbopack). La cohérence des données et des statuts a été vérifiée par des tests manuels ciblés et un seed reproductible.
'@
Add-Paragraph -Doc $doc -Text $t5

# Limites & Perspectives
Add-Heading -Doc $doc -Text 'Limites et perspectives' -Level 2
Add-Bullets -Doc $doc -Items @(
  "Renforcer les tests d’intégration et E2E; ajouter couverture sur flux critiques.",
  "Observabilité: journaux, métriques et alertes à industrialiser.",
  "Évolutions: notifications push, internationalisation complète, application mobile, analytics."
)

# Conclusion personnelle
Add-Heading -Doc $doc -Text 'Conclusion personnelle' -Level 2
$t6 = @'
Ce TFE m’a permis d’approfondir Next.js 15, Prisma, l’intégration de paiements (Stripe) et l’authentification (Auth.js) dans un cadre professionnel. La démarche itérative, la documentation et l’attention portée à la sécurité/RGPD ont été centrales. Le projet est prêt pour une mise à l’échelle progressive avec une feuille de route claire.
'@
Add-Paragraph -Doc $doc -Text $t6

# Références internes
Add-Heading -Doc $doc -Text 'Références internes au dépôt' -Level 2
Add-Bullets -Doc $doc -Items @(
  "Architecture: analyses/architecture_nextjs.puml",
  "UML: analyses/UML/*.puml (use cases, classes, séquences).",
  "Spécification API: analyses/OpenAPI_ColisApp.yaml; route swagger.",
  "Schéma et migrations: prisma/schema.prisma, prisma/migrations.",
  "Commandes: package.json (dev, build, lint, seed, reset)."
)

$outDir = Join-Path $PSScriptRoot '.'
$outPath = Join-Path $outDir 'TFE_Resume.docx'
$doc.SaveAs([ref]$outPath)
$doc.Close()
$word.Quit()

Write-Host "Résumé généré: $outPath"
