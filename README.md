
# 📦 ColisApp – Gestion des envois de colis internationaux

**ColisApp** est une application web moderne, développée avec [Next.js](https://nextjs.org/), permettant aux **particuliers** et **agences** d’envoyer, simuler, payer et suivre des colis entre la Belgique et le Maroc 🇧🇪 ➡️ 🇲🇦. Elle offre une plateforme sécurisée, ergonomique et évolutive, avec une architecture modulaire et professionnelle.

---

## 🚀 Fonctionnalités clés

- 🔐 Authentification sécurisée (email + Google via Auth.js)
- 💰 Paiement en ligne (Stripe - mode test)
- 📦 Suivi de colis par numéro de tracking
- 📊 Simulation des coûts d’envoi sans inscription
- 🧾 Gestion des envois, des destinataires et de l’historique
- 📬 Notifications automatiques par email (via Nodemailer)
- 🏢 Administration multi-agences avec rôles (`CLIENT`, `AGENCY_ADMIN`, `SUPER_ADMIN`)
- 🌍 Prête pour l’internationalisation (fr/ar/en)

---

## 🧑‍💻 Technologies

| Technologie        | Usage                                 |
|--------------------|----------------------------------------|
| **Next.js 15**     | Frontend + API fullstack               |
| **Prisma ORM**     | Accès base de données PostgreSQL       |
| **Tailwind CSS**   | Design responsive utilitaire           |
| **TypeScript**     | Typage strict & sécurité               |
| **Stripe**         | Paiement sécurisé (mode test)          |
| **Auth.js**        | Authentification (email, Google)       |
| **ShadCN**         | UI professionnelle (composants React)  |
| **Vercel**         | Hébergement                            |

---

## ⚙️ Installation locale

1. **Cloner le projet** :

```bash
git clone https://github.com/Bentouhami/vercel-colis-app-nextjs.git
cd colisapp
```

2. **Installer les dépendances** :

```bash
npm install
# ou
yarn install
```

3. **Configurer les variables d’environnement** :

Créer un fichier `.env.local` :

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
NEXTAUTH_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
```

4. **Lancer le serveur** :

```bash
npm run dev
```

L’application est disponible sur [http://localhost:3000](http://localhost:3000)

---

## 🧩 Structure du projet

```bash
.
  
├───prisma
│   │   schema.prisma
│   │   seed.js
│   │
│   ├───app
│   │   └───generated
│   │       └───prisma
│   │           └───client
│   │               │   client.d.ts
│   │               │   client.js
│   │               │   default.d.ts
│   │               │   default.js
│   │               │   edge.d.ts
│   │               │   edge.js
│   │               │   index-browser.js
│   │               │   index.d.ts
│   │               │   index.js
│   │               │   package.json
│   │               │   query_engine-windows.dll.node
│   │               │   query_engine_bg.js
│   │               │   query_engine_bg.wasm
│   │               │   schema.prisma
│   │               │   wasm-edge-light-loader.mjs
│   │               │   wasm-worker-loader.mjs
│   │               │   wasm.d.ts
│   │               │   wasm.js
│   │               │
│   │               └───runtime
│   │                       edge-esm.js
│   │                       edge.js
│   │                       index-browser.d.ts
│   │                       index-browser.js
│   │                       library.d.ts
│   │                       library.js
│   │                       react-native.js
│   │                       wasm.js
│   │
│   └───migrations ( prisma migrations )
│
├───public
│   │   next.svg
│   │   vercel.svg
│   │
│   ├───datas
│   │       cities.json
│   │       countries+cities.json
│   │
│   └───svg
│       ├───home
│       │       welcome.svg
│       │
│       ├───login
│       │       login.svg
│       │       register.svg
│       │
│       └───reset-forgot-password
│               forgot-password.svg
│               reset-password.svg
│
└───src
    │   middleware.ts
    │
    ├───actions
    │       UserActions.ts
    │
    ├───app
    │   │   favicon.ico
    │   │   globals.css
    │   │   layout.tsx
    │   │   not-found.tsx
    │   │   page.tsx
    │   │
    │   ├───admin
    │   │   │   layout.tsx
    │   │   │   not-found.tsx
    │   │   │   page.tsx
    │   │   │
    │   │   ├───agence
    │   │   │       page.tsx
    │   │   │
    │   │   ├───agencies
    │   │   │   │   page.tsx
    │   │   │   │
    │   │   │   ├───new
    │   │   │   │       page.tsx
    │   │   │   │
    │   │   │   └───[id]
    │   │   │       └───edit
    │   │   │               page.tsx
    │   │   │
    │   │   ├───customers
    │   │   │       page.tsx
    │   │   │
    │   │   ├───envois
    │   │   │       page.tsx
    │   │   │
    │   │   ├───export
    │   │   │       page.tsx
    │   │   │
    │   │   ├───reports
    │   │   │       page.tsx
    │   │   │
    │   │   ├───settings
    │   │   │       page.tsx
    │   │   │
    │   │   ├───stats
    │   │   │       page.tsx
    │   │   │
    │   │   └───users
    │   │       │   page.tsx
    │   │       │
    │   │       ├───new
    │   │       │       page.tsx
    │   │       │
    │   │       └───[id]
    │   │           └───edit
    │   │                   page.tsx
    │   │
    │   ├───api
    │   │   ├───auth
    │   │   │   ├───status
    │   │   │   │       route.ts
    │   │   │   │
    │   │   │   └───[...nextauth]
    │   │   │           route.ts
    │   │   │
    │   │   ├───send-email
    │   │   │       route.ts
    │   │   │
    │   │   └───v1
    │   │       ├───(auth)
    │   │       │   ├───check-reset-token
    │   │       │   │       route.ts
    │   │       │   │
    │   │       │   ├───forgot-password
    │   │       │   │       route.ts
    │   │       │   │
    │   │       │   └───reset-password
    │   │       │           route.ts
    │   │       │
    │   │       ├───addresses
    │   │       │   │   route.ts
    │   │       │   │
    │   │       │   └───[id]
    │   │       │           route.ts
    │   │       │
    │   │       ├───agencies
    │   │       │   │   route.ts
    │   │       │   │
    │   │       │   ├───admin-agencies
    │   │       │   │       route.ts
    │   │       │   │
    │   │       │   ├───create-agency
    │   │       │   │       route.ts
    │   │       │   │
    │   │       │   ├───findAgency
    │   │       │   │       route.ts
    │   │       │   │
    │   │       │   ├───get-agency-by-id
    │   │       │   │   │   route.ts
    │   │       │   │   │
    │   │       │   │   └───[id]
    │   │       │   │           route.ts
    │   │       │   │
    │   │       │   ├───light
    │   │       │   │       route.ts
    │   │       │   │
    │   │       │   ├───summary
    │   │       │   │       route.ts
    │   │       │   │
    │   │       │   ├───update-agency
    │   │       │   │       route.ts
    │   │       │   │
    │   │       │   └───[agency]
    │   │       │           route.ts
    │   │       │
    │   │       ├───cities
    │   │       │   │   route.ts
    │   │       │   │
    │   │       │   └───[countryId]
    │   │       │           route.ts
    │   │       │
    │   │       ├───contact
    │   │       │       route.ts
    │   │       │
    │   │       ├───countries
    │   │       │   │   route.ts
    │   │       │   │
    │   │       │   └───all
    │   │       │           route.ts
    │   │       │
    │   │       ├───envois
    │   │       │   ├───cancel
    │   │       │   │       route.ts
    │   │       │   │
    │   │       │   ├───user
    │   │       │   │   └───[userId]
    │   │       │   │           route.ts
    │   │       │   │
    │   │       │   └───[id]
    │   │       │           route.ts
    │   │       │
    │   │       ├───payment
    │   │       │   │   route.ts
    │   │       │   │
    │   │       │   └───complete-payment
    │   │       │           route.ts
    │   │       │
    │   │       ├───simulations
    │   │       │   │   route.ts
    │   │       │   │
    │   │       │   ├───delete-cookies
    │   │       │   │       route.ts
    │   │       │   │
    │   │       │   ├───edit
    │   │       │   │       route.ts
    │   │       │   │
    │   │       │   └───[id]
    │   │       │           route.ts
    │   │       │
    │   │       ├───tarifs
    │   │       │       route.ts
    │   │       │
    │   │       ├───transports
    │   │       │       route.ts
    │   │       │
    │   │       └───users
    │   │           │   route.ts
    │   │           │
    │   │           ├───all
    │   │           │       routes.ts
    │   │           │
    │   │           ├───destinataires
    │   │           │       route.ts
    │   │           │
    │   │           ├───list
    │   │           │       route.ts
    │   │           │
    │   │           ├───login
    │   │           │       route.ts
    │   │           │
    │   │           ├───logout
    │   │           │       route.ts
    │   │           │
    │   │           ├───register
    │   │           │       route.ts
    │   │           │
    │   │           ├───verify
    │   │           │       route.ts
    │   │           │
    │   │           └───[id]
    │   │               │   route.ts
    │   │               │
    │   │               └───profile
    │   │                       route.ts
    │   │
    │   ├───client
    │   │   │   layout.tsx
    │   │   │   not-found.tsx
    │   │   │   page.tsx
    │   │   │
    │   │   ├───about
    │   │   │       page.tsx
    │   │   │
    │   │   ├───auth
    │   │   │   ├───forgot-password
    │   │   │   │       page.tsx
    │   │   │   │
    │   │   │   ├───login
    │   │   │   │       Login.module.css
    │   │   │   │       page.tsx
    │   │   │   │
    │   │   │   ├───register
    │   │   │   │       page.tsx
    │   │   │   │
    │   │   │   ├───reset-password
    │   │   │   │       page.tsx
    │   │   │   │
    │   │   │   └───verify-email
    │   │   │           page.tsx
    │   │   │
    │   │   ├───contact-us
    │   │   │       page.tsx
    │   │   │
    │   │   ├───envois
    │   │   │   ├───details
    │   │   │   │       page.tsx
    │   │   │   │
    │   │   │   └───recapitulatif
    │   │   │           page.tsx
    │   │   │           recapSkeleton.tsx
    │   │   │
    │   │   ├───payment
    │   │   │   │   page.tsx
    │   │   │   │
    │   │   │   ├───payment-cancel
    │   │   │   │       page.tsx
    │   │   │   │
    │   │   │   └───payment-success
    │   │   │           page.tsx
    │   │   │
    │   │   ├───profile
    │   │   │   │   layout.tsx
    │   │   │   │   page.tsx
    │   │   │   │
    │   │   │   ├───appointments
    │   │   │   │       page.tsx
    │   │   │   │
    │   │   │   ├───deliveries
    │   │   │   │       page.tsx
    │   │   │   │
    │   │   │   ├───notifications
    │   │   │   │       page.tsx
    │   │   │   │
    │   │   │   └───settings
    │   │   │           page.tsx
    │   │   │
    │   │   ├───services
    │   │   │       page.tsx
    │   │   │
    │   │   ├───simulation
    │   │   │   │   page.tsx
    │   │   │   │   simulationSkeleton.tsx
    │   │   │   │
    │   │   │   ├───ajouter-destinataire
    │   │   │   │       destinataireSkeleton.tsx
    │   │   │   │       page.tsx
    │   │   │   │
    │   │   │   ├───edit
    │   │   │   │       page.tsx
    │   │   │   │
    │   │   │   └───results
    │   │   │           page.tsx
    │   │   │           resultsSkeleton.tsx
    │   │   │
    │   │   ├───tarifs
    │   │   │       page.tsx
    │   │   │
    │   │   ├───tracking
    │   │   │   └───[trackingNum]
    │   │   │           page.tsx
    │   │   │
    │   │   └───unauthorized
    │   │           page.tsx
    │   │
    │   └───login
    │           page.tsx
    │
    ├───auth
    │       auth.ts
    │
    ├───components
    │   │   app-sidebar.tsx
    │   │   calendar-date-picker.tsx
    │   │   login-form.tsx
    │   │   nav-actions.tsx
    │   │   nav-favorites.tsx
    │   │   nav-main.tsx
    │   │   nav-projects.tsx
    │   │   nav-secondary.tsx
    │   │   nav-user.tsx
    │   │   nav-workspaces.tsx
    │   │   NotFound.tsx
    │   │   phone-input.tsx
    │   │   providers.tsx
    │   │   simple-time-picker.tsx
    │   │   team-switcher.tsx
    │   │   theme-provider.tsx
    │   │
    │   ├───address
    │   │       AddressForm.tsx
    │   │       country-city-selector.tsx
    │   │       countryDropdown.tsx
    │   │
    │   ├───admin
    │   │   │   SearchBar.tsx
    │   │   │   theme-provider.tsx
    │   │   │
    │   │   ├───charts
    │   │   │       CustomerGrowthChart.tsx
    │   │   │       DashboardCharts.tsx
    │   │   │       LineChart.tsx
    │   │   │       RevenueChart.tsx
    │   │   │       TotalInvoicesChart.tsx
    │   │   │
    │   │   ├───collections
    │   │   │       AgenciesList.tsx
    │   │   │       UsersList.tsx
    │   │   │
    │   │   └───menu
    │   │           Footer.tsx
    │   │           Header.tsx
    │   │           MobileMenu.tsx
    │   │           mode-toggle.tsx
    │   │           Sidebar.tsx
    │   │
    │   ├───auth
    │   │       AuthProvider.tsx
    │   │       LoginInformationForm.tsx
    │   │       PersonalInformationForm.tsx
    │   │       RequireAuth.tsx
    │   │
    │   ├───buttons
    │   │       LoginButton.tsx
    │   │       LogoutButton.tsx
    │   │       RegisterButton.tsx
    │   │
    │   ├───client-specific
    │   │   ├───envois
    │   │   │       EnvoiHistory.tsx
    │   │   │
    │   │   ├───profile
    │   │   │       AppointmentsList.tsx
    │   │   │       DeliveriesList.tsx
    │   │   │       DeliveryDetails.tsx
    │   │   │       NotificationsList.tsx
    │   │   │       ProfileComponent.tsx
    │   │   │       ProfileSideMenu.tsx
    │   │   │       SettingsComponent.tsx
    │   │   │
    │   │   └───simulation
    │   │           simulation-country-city-selector.tsx
    │   │           SimulationResults.module.css
    │   │           SimulationResults.tsx
    │   │
    │   ├───conatct-us
    │   │       ContactComponent.tsx
    │   │
    │   ├───forms
    │   │   ├───admins
    │   │   │       AgencyForm.tsx
    │   │   │       AgencyList.tsx
    │   │   │       AgencySelector.tsx
    │   │   │       UsersForm.tsx
    │   │   │
    │   │   ├───AuthForms
    │   │   │       ForgotPasswordForm.tsx
    │   │   │       LoginForm.tsx
    │   │   │       RegisterForm.tsx
    │   │   │       ResetPasswordForm.tsx
    │   │   │
    │   │   ├───EnvoiForms
    │   │   │       AddReceiverForm.tsx
    │   │   │       AddReceiverFormSkeleton.tsx
    │   │   │
    │   │   ├───SimulationForms
    │   │   │       AgencySelectForm.tsx
    │   │   │       CitySelectForm.tsx
    │   │   │       CountrySelectForm.tsx
    │   │   │       PackageForm.tsx
    │   │   │       Simulation.module.css
    │   │   │       SimulationEditForm.tsx
    │   │   │       SimulationForm.tsx
    │   │   │
    │   │   └───styles
    │   │           RegisterForm.module.css
    │   │           Simulation.module.css
    │   │
    │   ├───modals
    │   │       LoginPromptModal.tsx
    │   │       SimulationConfirmationModal.tsx
    │   │
    │   ├───navigations
    │   │   ├───brand
    │   │   │       brand.module.css
    │   │   │       ColisBrand.tsx
    │   │   │
    │   │   ├───footer
    │   │   │       Footer.tsx
    │   │   │
    │   │   └───header
    │   │           Header.module.css
    │   │           HeaderNavbar.tsx
    │   │           HeaderWithPathname.tsx
    │   │           HeaderWrapper.tsx
    │   │
    │   ├───notifications
    │   │       NotificationCard.tsx
    │   │
    │   ├───pricing
    │   │       Pricing.tsx
    │   │
    │   ├───sections
    │   │       AboutSection.tsx
    │   │       ContactSection.tsx
    │   │       FeaturesSection.tsx
    │   │       HeroSection.tsx
    │   │
    │   ├───skeletons
    │   │       ListSkeleton.tsx
    │   │
    │   ├───tarifs
    │   │       TarifsComponent.tsx
    │   │
    │   ├───tracking
    │   │       TrackingComponent.tsx
    │   │
    │   ├───ui ( shadcn components)
    │   │
    │   └───users
    │           BaseUserForm.tsx
    │           MultiStepRegistrationForm.tsx
    │           NewAccountant.tsx
    │           NewAdminForm.tsx
    │           NewCustomer.tsx
    │           NewSuperAdminsForm.tsx
    │           StepIndicator.tsx
    │
    ├───config
    │       cloudinary.ts
    │
    ├───data
    │       cities.json
    │       countries.json
    │       states.json
    │
    ├───hooks
    │       use-mobile.tsx
    │       use-toast.ts
    │       useSimulationLogic.ts
    │
    ├───lib
    │       auth.ts
    │       mailer.ts
    │       prisma.ts
    │       simulationCookie.ts
    │       utils.ts
    │
    ├───services
    │   ├───backend-services
    │   │       Bk_AddressService.ts
    │   │       Bk_AgencyService.ts
    │   │       Bk_AuthService.ts
    │   │       Bk_CityService.ts
    │   │       Bk_CountryService.ts
    │   │       Bk_EnvoiService.ts
    │   │       Bk_SimulationService.ts
    │   │       Bk_TarifService.ts
    │   │       Bk_TransportService.ts
    │   │       Bk_UserService.ts
    │   │
    │   ├───dal
    │   │   └───DAO
    │   │       ├───agencies
    │   │       │       AgencyDAO.ts
    │   │       │       IAgencyDAO.ts
    │   │       │
    │   │       ├───envois
    │   │       │       EnvoiDAO.ts
    │   │       │       IEnvoiDAO.ts
    │   │       │
    │   │       ├───parcels
    │   │       │       IParcelDAO.ts
    │   │       │       ParcelDAO.ts
    │   │       │
    │   │       ├───simulations
    │   │       │       ISimulationDAO.ts
    │   │       │       SimulationDAO.ts
    │   │       │
    │   │       ├───tarifs
    │   │       │       ITarifDAO.ts
    │   │       │       TarifDAO.ts
    │   │       │
    │   │       └───transports
    │   │               ITransportDAO.ts
    │   │               TransportDAO.ts
    │   │
    │   ├───dtos
    │   │   │   index.ts
    │   │   │
    │   │   ├───addresses
    │   │   │       AddressDto.ts
    │   │   │
    │   │   ├───agencies
    │   │   │       AgencyDto.ts
    │   │   │
    │   │   ├───agencyStaffs
    │   │   │       AgencyStaffDto.ts
    │   │   │
    │   │   ├───appointments
    │   │   │       AppointmentDto.ts
    │   │   │
    │   │   ├───auth
    │   │   │       authDtos.ts
    │   │   │
    │   │   ├───cities
    │   │   │       CityDto.ts
    │   │   │
    │   │   ├───countries
    │   │   │       CountryDto.ts
    │   │   │
    │   │   ├───coupons
    │   │   │       CouponDto.ts
    │   │   │
    │   │   ├───emails
    │   │   │       EmailDto.ts
    │   │   │
    │   │   ├───enums
    │   │   │       EnumsDto.ts
    │   │   │
    │   │   ├───envois
    │   │   │       EnvoiDto.ts
    │   │   │       PaymentSuccessDto.ts
    │   │   │
    │   │   ├───notifications
    │   │   │       NotificationDto.ts
    │   │   │
    │   │   ├───parcels
    │   │   │       ParcelDto.ts
    │   │   │
    │   │   ├───simulations
    │   │   │       SimulationResponseDto.ts
    │   │   │
    │   │   ├───tarifs
    │   │   │       TarifDto.ts
    │   │   │
    │   │   ├───transports
    │   │   │       TransportDto.ts
    │   │   │
    │   │   └───users
    │   │           UserDto.ts
    │   │
    │   ├───frontend-services
    │   │   │   AddressService.ts
    │   │   │   AgencyService.ts
    │   │   │   AuthService.ts
    │   │   │   NotificationService.ts
    │   │   │   TarifsService.ts
    │   │   │   UserService.ts
    │   │   │
    │   │   ├───agencies
    │   │   │       AgencyService.ts
    │   │   │
    │   │   ├───appointement
    │   │   │       AppointmentService.ts
    │   │   │
    │   │   ├───city
    │   │   │       CityService.ts
    │   │   │
    │   │   ├───contact
    │   │   │       ContactService.ts
    │   │   │
    │   │   ├───country
    │   │   │       CountryService.ts
    │   │   │
    │   │   ├───envoi
    │   │   │       EnvoiService.ts
    │   │   │
    │   │   ├───payment
    │   │   │       paymentService.ts
    │   │   │
    │   │   ├───simulation
    │   │   │       SimulationCalculationService.ts
    │   │   │       SimulationService.ts
    │   │   │
    │   │   └───transport
    │   │           TransportService.ts
    │   │           TransportServiceCalc.ts
    │   │
    │   ├───mappers
    │   │       user.mapper.ts
    │   │
    │   └───repositories
    │       ├───addresses
    │       │       AddressRepository.ts
    │       │       IAddressRepository.ts
    │       │
    │       ├───agencies
    │       │       AgencyRepository.ts
    │       │       IAgencyRepository.ts
    │       │
    │       ├───AgencyStaffs
    │       │       agencyStaffRepository.ts
    │       │       IAgencyStaffRepository.ts
    │       │
    │       ├───envois
    │       │       EnvoiRepository.ts
    │       │       IEnvoiRepository.ts
    │       │
    │       ├───parcels
    │       │       IParcelRepository.ts
    │       │       ParcelRepository.ts
    │       │
    │       ├───simulations
    │       │       ISimulationRepository.ts
    │       │       SimulationRepository.ts
    │       │
    │       ├───tarifs
    │       │       ITarifRepositories.ts
    │       │       TarifRepositories.ts
    │       │
    │       ├───transports
    │       │       ITransportRepository.ts
    │       │       TransportRepository.ts
    │       │
    │       └───users
    │               IUserRepository.ts
    │               UserRepository.ts
    │
    ├───types
    │       next-auth.d.ts
    │
    └───utils
            accessControlHelper.ts
            axiosInstance.ts
            constants.ts
            cors.ts
            dateUtils.ts
            db.ts
            dtos.ts
            generateSimulationToken.ts
            generateToken.ts
            generateTrackingNumber.ts
            handelErrors.ts
            handleCors.ts
            helpers.ts
            publicRoutesHelper.ts
            qrUtils.ts
            stringUtils.ts
            types.ts
            validationSchema.ts
            verifySimulationToken.ts
            verifyToken.ts

```

---

## 📐 Architecture

```plaintext
[Client Pages]
   ↓
[Frontend Services]
   ↓
[API Routes] (Next.js API)
   ↓
[Backend Services]
   ↓
[Prisma ORM] → PostgreSQL
```

---

## ✅ Statut du projet

- [x] Authentification JWT & OAuth
- [x] Simulation en ligne sans compte
- [x] Paiement Stripe (test)
- [x] Suivi colis & notifications email
- [x] Dashboard administrateur
- [ ] 🌍 Ajout de pays supplémentaires
- [ ] 📱 Version mobile (PWA)

---

## 🔐 Sécurité

- Hashage des mots de passe (`bcrypt`)
- Authentification avec token JWT
- Vérification d’email & gestion des rôles
- Middleware de protection des routes API/pages
- Déploiement sécurisé sur Vercel (HTTPS)

---

## 📘 Dossier TFE

Ce projet a été réalisé dans le cadre du **Travail de Fin d'Études (TFE)** à l’**IRAMPS (Mons)** – Bachelier en Informatique de Gestion.

Le dossier comprend :

- Modèle de données (MCD → MLD → MPD)
- Diagrammes UML (use cases, séquence, classe)
- User stories et analyse fonctionnelle
- Plan de tests
- Wireframes
- Références techniques

📄 Voir le dossier complet : `TFE- Dossier d'Analyse - ColisApp NEW.docx`

---

## 🤝 Remerciements

Projet encadré par **Mr. Gilles Poulet**  
Développé par **Faisal Bentouhami** – IRAMPS 2024-2025

---

## 📜 Licence

Usage académique uniquement – tous droits réservés.
