# Role-Based Access Control

This document outlines which roles have access to which routes in the application.

## Page Routes

### Publicly Accessible Routes (No Login Required)

* `/`
* `/client/about`
* `/client/services`
* `/client/contact-us`
* `/client/simulation`
* `/client/tracking`
* `/auth/login`
* `/auth/register`
* `/auth/forgot-password`
* `/auth/reset-password`
* `/auth/verify-email`

### CLIENT and DESTINATAIRE Routes

These users can access all public routes plus the following:

* `/client`
* `/client/envois/recapitulatif`
* `/client/payment`
* `/client/payment/payment-cancel`
* `/client/payment/payment-success`
* `/client/profile`
* `/client/profile/appointments`
* `/client/profile/appointments/book`
* `/client/profile/deliveries`
* `/client/profile/mes-destinataires`
* `/client/profile/notifications`
* `/client/profile/payments`
* `/client/profile/settings`
* `/client/simulation/ajouter-destinataire`
* `/client/simulation/edit`
* `/client/simulation/results`
* `/client/tarifs`
* `/client/tracking/[trackingNum]`
* `/client/unauthorized`

### Admin Routes (SUPER_ADMIN, AGENCY_ADMIN, ACCOUNTANT)

These users can access all public routes plus the following:

* `/admin`
* `/admin/agencies`
* `/admin/agencies/new`
* `/admin/agencies/[id]/edit`
* `/admin/customers`
* `/admin/envois`
* `/admin/export`
* `/admin/reports`
* `/admin/settings`
* `/admin/stats`
* `/admin/users`
* `/admin/users/new`
* `/admin/users/[id]/edit`

## API Routes

### User API Routes

* **GET `/api/v1/users`**:
  * **SUPER_ADMIN**: Can retrieve a list of all users.
  * **AGENCY_ADMIN**: Can retrieve a list of users associated with their agency.
  * **Other Roles**: Not authorized.
* **GET `/api/v1/users/list`**:
  * **SUPER_ADMIN**: Can retrieve a list of all users.
  * **AGENCY_ADMIN**: Can retrieve a list of users associated with their agency.
  * **Other Roles**: Not authorized.
* **POST `/api/v1/users/destinataires`**:
  * **CLIENT**: Can create a new `DESTINATAIRE` and associate them with their own account.
  * **Other Roles**: While not explicitly blocked, the logic is designed for clients.
* **GET `/api/v1/users/[id]`**:
  * **All Roles (including unauthenticated users)**: Can retrieve user information. **This is a potential security vulnerability.**
* **DELETE `/api/v1/users/[id]`**:
  * **All Roles (including unauthenticated users)**: Can delete a user. **This is a critical security vulnerability.**
* **GET `/api/v1/users/[id]/profile`**:
  * **All Roles (including unauthenticated users)**: Can retrieve user profile information. **This is a potential security vulnerability.**
* **PUT `/api/v1/users/[id]/profile`**:
  * **All Roles (including unauthenticated users)**: Can update a user's profile. **This is a critical security vulnerability.**
* **POST `/api/v1/users/login`**:
  * **Public**: This route is accessible to everyone for the purpose of logging in.
* **GET `/api/v1/users/logout`**:
  * **Public**: This route is accessible to everyone for the purpose of logging out. It is protected by a CORS policy.
* **POST `/api/v1/users/register`**:
  * **Public**: This route is accessible to everyone for the purpose of creating a new user account.
* **POST `/api/v1/users/verify`**:
  * **Public**: This route is accessible to everyone for the purpose of verifying their email address with a token.
* **GET `/api/v1/users/appointments/envoi-paye`**:
  * **CLIENT**: Can retrieve their first paid shipment that doesn't have an appointment.
  * **Other Roles**: While not explicitly blocked, this route is designed for clients.
* **POST `/api/v1/users/appointments/book`**:
  * **CLIENT**: Can book an appointment for their paid shipment.
  * **Other Roles**: While not explicitly blocked, this route is designed for clients.

### Agency API Routes

* **GET `/api/v1/agencies`**:
  * **Public**: This route is accessible to everyone and returns a list of agencies for a given city.
* **GET `/api/v1/agencies/admin-agencies`**:
  * **SUPER_ADMIN**: Can retrieve a list of all agencies.
  * **AGENCY_ADMIN**: Can retrieve a list of agencies associated with their account.
  * **Other Roles**: Not authorized.
* **POST `/api/v1/agencies/create-agency`**:
  * **SUPER_ADMIN**: Can create a new agency.
  * **Other Roles**: Not authorized.
* **GET `/api/v1/agencies/findAgency`**:
  * **Public**: This route is accessible to everyone and returns the ID of an agency based on country, city, and agency name.
* **GET `/api/v1/agencies/get-agency-by-id`**:
  * **SUPER_ADMIN** or **AGENCY_ADMIN**: Can retrieve agency information.
  * **Other Roles**: Not authorized.
* **GET `/api/v1/agencies/get-agency-by-id/[id]`**:
  * **All Roles (including unauthenticated users)**: Can retrieve agency information. **This is a potential security vulnerability.**
* **GET `/api/v1/agencies/light`**:
  * **Public**: This route is accessible to everyone and returns a list of agencies with minimal information.
* **GET `/api/v1/agencies/summary`**:
  * **Public**: This route currently returns `null` and appears to be a placeholder.
* **PUT `/api/v1/agencies/update-agency`**:
  * **All Roles (including unauthenticated users)**: Can update agency information. **This is a critical security vulnerability.**
* **GET `/api/v1/agencies/[agency]`**:
  * **Public**: This route is accessible to everyone and returns the ID of an agency based on its name.

### Other API Routes

* **GET `/api/v1/addresses`**:
  * **All Roles (including unauthenticated users)**: Can retrieve all addresses. **This is a potential security vulnerability.**
* **POST `/api/v1/addresses`**:
  * **All Roles (including unauthenticated users)**: Can create a new address. **This is a critical security vulnerability.**
* **GET `/api/v1/addresses/[id]`**:
  * **All Roles (including unauthenticated users)**: Can retrieve address information. **This is a potential security vulnerability.**
* **PUT `/api/v1/addresses/[id]`**:
  * **All Roles (including unauthenticated users)**: Can update an address. **This is a critical security vulnerability.**
* **GET `/api/v1/admin/dashboard`**:
  * **SUPER_ADMIN, AGENCY_ADMIN, ACCOUNTANT**: Can access dashboard data. The data returned is specific to the user's role.
  * **Other Roles**: Not authorized.
* **GET `/api/v1/cities`**:
  * **Public**: This route is accessible to everyone and returns a list of cities that have an agency for a given country.
* **GET `/api/v1/cities/[countryId]`**:
  * **Public**: This route is accessible to everyone and returns a list of cities for a given country.
* **POST `/api/v1/contact`**:
  * **Public**: This route is accessible to everyone for sending a contact message and is protected by a CORS policy.
* **GET `/api/v1/countries`**:
  * **Public**: This route is accessible to everyone and returns a list of distinct countries with agencies, with an optional filter for the departure country.
* **GET `/api/v1/countries/all`**:
  * **Public**: This route is accessible to everyone and returns a list of all countries.
* **GET `/api/v1/dashboard/super-admin`**:
  * **All Roles (including unauthenticated users)**: Can access super admin dashboard data. **This is a critical security vulnerability.**
* **PUT `/api/v1/envois/[id]`**:
  * **All Roles (including unauthenticated users)**: Can update shipment information. **This is a critical security vulnerability.**
* **GET `/api/v1/envois/[id]`**:
  * **All Roles (including unauthenticated users)**: Can retrieve shipment information. **This is a potential security vulnerability.**
* **POST `/api/v1/envois/cancel`**:
  * **All Roles (including unauthenticated users)**: Can cancel a shipment. **This is a critical security vulnerability.**
* **GET `/api/v1/envois/user/[userId]`**:
  * **All Roles (including unauthenticated users)**: Can retrieve all of a user's shipments. **This is a potential security vulnerability.**
* **GET `/api/v1/payment/complete-payment`**:
  * **Public (with token)**: This route is accessible to anyone with a valid simulation token. The security of this endpoint depends on the strength and secrecy of the simulation token.
* **POST `/api/v1/payment`**:
  * **Public**: This route is accessible to everyone for creating a Stripe checkout session.
* **GET `/api/v1/simulations`**:
  * **Public (with token)**: This route is accessible to anyone with a valid simulation token from their cookies.
* **POST `/api/v1/simulations`**:
  * **All Users**: Both authenticated and unauthenticated users can create a new simulation.
* **PUT `/api/v1/simulations`**:
  * **Authenticated Users**: Can update a simulation.
* **GET `/api/v1/simulations/[id]`**:
  * **All Roles (including unauthenticated users)**: Can retrieve simulation information. **This is a potential security vulnerability.**
* **PUT `/api/v1/simulations/[id]`**:
  * **All Roles (including unauthenticated users)**: Can update a simulation. **This is a critical security vulnerability.**
* **GET `/api/v1/simulations/delete-cookies`**:
  * **Public**: This route is accessible to everyone and deletes the simulation cookie.
* **PUT `/api/v1/simulations/edit`**:
  * **Authenticated Users**: Can update a simulation, and their `userId` will be associated with the update.
  * **Unauthenticated Users**: Can update a simulation, but the `userId` will be `null`. **This is a potential security vulnerability**, as it might allow an unauthenticated user to modify a simulation they do not own.
* **GET `/api/v1/tarifs`**:
  * **Public**: This route is accessible to everyone and returns a list of prices.
* **GET `/api/v1/tracking/[trackingNumber]`**:
  * **All Roles (including unauthenticated users)**: Can retrieve tracking information for any shipment. **This is a potential security vulnerability.**
* **POST `/api/v1/tracking/[trackingNumber]`**:
  * **All Roles (including unauthenticated users)**: Can add a tracking event to any shipment. **This is a critical security vulnerability.**
* **POST `/api/v1/tracking`**:
  * **Admin Roles (likely)**: Requires authentication and calls a function named `adminAddEvent`, which suggests that only admin roles can add tracking events.
* **GET `/api/v1/transports`**:
  * **All Roles (including unauthenticated users)**: Can retrieve all transports. **This is a potential security vulnerability.**
* **PUT `/api/v1/transports`**:
  * **All Roles (including unauthenticated users)**: Can update any transport. **This is a critical security vulnerability.**
* **GET `/api/auth/status`**:
  * **Public**: This route is accessible to everyone. It checks for a valid authentication token in the cookies and returns the user's information if found.
* **POST `/api/auth/verify-credentials`**:
  * **Public**: This route is accessible to everyone for verifying their email and password.
* **POST `/api/send-email`**:
  * **Public**: This route is accessible to everyone for sending a verification email.
* **GET `/api/v1/(auth)/check-reset-token`**:
  * **Public**: This route is accessible to everyone for checking the validity of a password reset token.
* **POST `/api/v1/(auth)/forgot-password`**:
  * **Public**: This route is accessible to everyone for requesting a password reset email.
* **POST `/api/v1/(auth)/reset-password`**:
  * **Public**: This route is accessible to everyone for resetting their password with a valid token.

## Security Vulnerabilities

During the analysis of the API routes, several security vulnerabilities were identified. These vulnerabilities are due to the lack of authentication and authorization checks in the route handlers. This means that anyone can access these routes and perform actions that should be restricted to authenticated and authorized users.

Here is a list of the identified vulnerabilities:

* **GET `/api/v1/users/[id]`**: Anyone can retrieve user information.
* **DELETE `/api/v1/users/[id]`**: Anyone can delete a user.
* **GET `/api/v1/users/[id]/profile`**: Anyone can retrieve user profile information.
* **PUT `/api/v1/users/[id]/profile`**: Anyone can update a user's profile.
* **GET `/api/v1/agencies/get-agency-by-id/[id]`**: Anyone can retrieve agency information.
* **PUT `/api/v1/agencies/update-agency`**: Anyone can update agency information.
* **GET `/api/v1/addresses`**: Anyone can retrieve all addresses.
* **POST `/api/v1/addresses`**: Anyone can create a new address.
* **GET `/api/v1/addresses/[id]`**: Anyone can retrieve address information.
* **PUT `/api/v1/addresses/[id]`**: Anyone can update an address.
* **GET `/api/v1/dashboard/super-admin`**: Anyone can access super admin dashboard data.
* **PUT `/api/v1/envois/[id]`**: Anyone can update shipment information.
* **GET `/api/v1/envois/[id]`**: Anyone can retrieve shipment information.
* **POST `/api/v1/envois/cancel`**: Anyone can cancel a shipment.
* **GET `/api/v1/envois/user/[userId]`**: Anyone can retrieve all of a user's shipments.
* **GET `/api/v1/simulations/[id]`**: Anyone can retrieve simulation information.
* **PUT `/api/v1/simulations/[id]`**: Anyone can update a simulation.
* **PUT `/api/v1/simulations/edit`**: An unauthenticated user can update a simulation.
* **GET `/api/v1/tracking/[trackingNumber]`**: Anyone can retrieve tracking information for any shipment.
* **POST `/api/v1/tracking/[trackingNumber]`**: Anyone can add a tracking event to any shipment.
* **GET `/api/v1/transports`**: Anyone can retrieve all transports.
* **PUT `/api/v1/transports`**: Anyone can update any transport.
