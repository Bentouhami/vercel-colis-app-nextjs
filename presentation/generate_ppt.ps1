Param(
  [switch]$InsertImages
)

# Generates a PowerPoint deck with titles, bullets, and speaker notes.
# If -InsertImages is passed and matching files exist in presentation/shots,
# the script inserts them in the corresponding slides.

$ErrorActionPreference = 'Stop'

function New-Slide {
  Param(
    [Parameter(Mandatory)][object]$Presentation,
    [Parameter(Mandatory)][int]$Index,
    [Parameter(Mandatory)][int]$Layout,
    [Parameter(Mandatory)][string]$Title,
    [string[]]$Bullets,
    [string]$Notes,
    [string]$ImageFile
  )
  $slide = $Presentation.Slides.Add($Index, $Layout)

  # Title
  if ($slide.Shapes.Placeholders.Count -ge 1) {
    $titleShape = $slide.Shapes.Placeholders.Item(1)
    if ($titleShape -and $titleShape.TextFrame) {
      $titleShape.TextFrame.TextRange.Text = $Title
    }
  }

  # Bulleted content (placeholder 2 if exists)
  if ($Bullets -and $slide.Shapes.Placeholders.Count -ge 2) {
    $contentShape = $slide.Shapes.Placeholders.Item(2)
    if ($contentShape -and $contentShape.TextFrame) {
      $contentShape.TextFrame.TextRange.Text = ($Bullets -join "`r`n")
      $contentShape.TextFrame.TextRange.ParagraphFormat.Bullet.Visible = -1  # msoTrue
    }
  } elseif ($Bullets) {
    # Fallback: add a textbox if no placeholder
    $tb = $slide.Shapes.AddTextbox(1, 60, 160, 600, 320)
    $tb.TextFrame.TextRange.Text = ($Bullets -join "`r`n")
    $tb.TextFrame.TextRange.ParagraphFormat.Bullet.Visible = -1
  }

  # Insert image if requested and file exists
  if ($InsertImages -and $ImageFile -and (Test-Path $ImageFile)) {
    # AddPicture(FileName, LinkToFile, SaveWithDocument, Left, Top, Width, Height)
    # Place it on the right; scale roughly to fit.
    $slide.Shapes.AddPicture($ImageFile, $false, $true, 520, 120, 380, 280) | Out-Null
  } elseif ($ImageFile) {
    # Placeholder note for image
    $ph = $slide.Shapes.AddTextbox(1, 520, 120, 380, 60)
    $ph.TextFrame.TextRange.Text = "Insérer capture: $(Split-Path $ImageFile -Leaf)"
  }

  # Speaker notes
  if ($Notes) {
    try {
      $notesShape = $slide.NotesPage.Shapes.Placeholders.Item(2)
      if ($notesShape -and $notesShape.TextFrame) {
        $notesShape.TextFrame.TextRange.Text = $Notes
      }
    } catch {
      # ignore if notes placeholder not accessible
    }
  }
}

$shotsDir = Join-Path $PSScriptRoot 'shots'
if (!(Test-Path $shotsDir)) { New-Item -ItemType Directory -Path $shotsDir | Out-Null }

# Slide definitions: title, bullets, notes, suggested image
$slides = @(
  @{ Title='ColisApp — Envoi, Paiement, Suivi'; Layout=1; Bullets=@('Belgique ↔ Maroc','Parcours unifié de la simulation au suivi'); Notes='Positionner la proposition de valeur et le public visé.'; Image='01-accueil-client.png' }
  @{ Title='Motivation & Justification'; Layout=2; Bullets=@('Processus fragmentés, coûts opaques','Centralisation, transparence, traçabilité'); Notes='Problème réel côté clients et agences; bénéfices attendus.'; Image='(none)'}
  @{ Title='Problématique'; Layout=2; Bullets=@('Parcours continu: simuler → créer → payer → suivre','Sécurité, RGPD, multi-rôles'); Notes='Formuler clairement les questions majeures.'; Image='(none)'}
  @{ Title='Objectifs & Périmètre'; Layout=2; Bullets=@('Simulation, envoi, paiement Stripe test','Tracking, multi‑agences, rôles'); Notes='MVP + critères non-fonctionnels essentiels.'; Image='(none)'}
  @{ Title='Démarche du chercheur'; Layout=2; Bullets=@('UML/MCD, OpenAPI','Itérations UI shadcn/Tailwind','Validations Zod'); Notes='Cycle concevoir → implémenter → valider → documenter.'; Image='(none)'}
  @{ Title='Architecture'; Layout=2; Bullets=@('Next.js 15 (App Router + API)','Prisma/PostgreSQL','Auth.js, Stripe, Cloudinary','Nginx (Docker)'); Notes='Front+API unifiés, DAL typé, intégrations sécurisées.'; Image='11-architecture.png'}
  @{ Title='Modèle de données'; Layout=2; Bullets=@('User, Agency, Parcel/Envoi, Payment','Tracking + statuts'); Notes='Illustrer relations clés et traçabilité.'; Image='12-uml-parcel.png'}
  @{ Title='API & Sécurité'; Layout=2; Bullets=@('Endpoints v1 (users, envois, tracking, payment)','Auth.js + RBAC; validations Zod','Secrets via .env (jamais commités)'); Notes='Contrats stables; principes de sécurité.'; Image='10-swagger.png'}
  @{ Title='Interface & UX'; Layout=2; Bullets=@('shadcn + Tailwind v4','Skeletons, toasts, responsive'); Notes='Montrer cohérence et feedback utilisateur.'; Image='01-accueil-client.png'}
  @{ Title='Démonstration — Parcours'; Layout=2; Bullets=@('1) Simulation  2) Connexion','3) Création envoi  4) Paiement test','5) Suivi'); Notes='Préparer seed + carte 4242 4242 4242 4242.'; Image='02-simulation-form.png'}
  @{ Title='Résultats & Évaluation'; Layout=2; Bullets=@('Parcours complet, données cohérentes','UI propre, charts admin'); Notes='Mettre en avant stabilité dev et UX.'; Image='08-admin-dashboard.png'}
  @{ Title='Limites & Risques'; Layout=2; Bullets=@('Tests intégration/E2E à renforcer','Observabilité/monitoring à compléter'); Notes='Être transparent et proposer une feuille de route.'; Image='(none)'}
  @{ Title='Conclusion personnelle'; Layout=2; Bullets=@('Acquis techniques et méthodo','Suite: push, i18n, mobile'); Notes='Clore sur la vision et les apprentissages.'; Image='(none)'}
  @{ Title='Questions'; Layout=2; Bullets=@('Merci — démo live possible'); Notes='Garder 1–2 min pour Q/R.'; Image='(none)'}
)

Write-Host 'Lancement de PowerPoint…'
$pp = New-Object -ComObject PowerPoint.Application
$pp.Visible = -1  # msoTrue

$pres = $pp.Presentations.Add()

$index = 1
foreach ($s in $slides) {
  $imgPath = $null
  if ($s.Image -and $s.Image -ne '(none)') { $imgPath = Join-Path $shotsDir $s.Image }
  New-Slide -Presentation $pres -Index $index -Layout $s.Layout -Title $s.Title -Bullets $s.Bullets -Notes $s.Notes -ImageFile $imgPath
  $index++
}

$outPath = Join-Path $PSScriptRoot 'ColisApp_TFE.pptx'
$pres.SaveAs($outPath)
Write-Host "Présentation générée: $outPath"

# Option: Uncomment to show the presentation at end
# $pp.ActivePresentation.SlideShowSettings.Run() | Out-Null

# Quitte PowerPoint si lancé en arrière-plan; laissez ouvert si vous voulez modifier
$pp.Quit()

