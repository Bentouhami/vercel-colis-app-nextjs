## 8. Glossaire

Ce glossaire définit les termes techniques et spécifiques au domaine utilisés dans ce dossier d'analyse et au sein du projet ColisApp.

* **API (Application Programming Interface)** : Ensemble de définitions et de protocoles permettant à différentes applications logicielles de communiquer entre elles.
* **API RESTful** : Style d'architecture pour les systèmes hypermédia distribués, basé sur le protocole HTTP, utilisant des méthodes standard (GET, POST, PUT, DELETE) pour manipuler des ressources.
* **App Router (Next.js)** : Nouveau système de routage de Next.js qui permet de créer des routes basées sur le système de fichiers, avec la possibilité d'utiliser des composants React Server Components.
* **Auth.js (NextAuth.js)** : Bibliothèque d'authentification flexible pour les applications Next.js, prenant en charge divers fournisseurs d'authentification (OAuth, identifiants, etc.) et la gestion des sessions.
* **Backend** : Partie d'une application qui gère la logique métier, les interactions avec la base de données et les serveurs. Elle n'est pas directement accessible par l'utilisateur final.
* **Bcrypt** : Fonction de hachage de mot de passe conçue pour être lente et résistante aux attaques par force brute, utilisée pour stocker les mots de passe de manière sécurisée.
* **CI/CD (Intégration Continue / Déploiement Continu)** : Pratiques de développement logiciel visant à automatiser l'intégration, les tests et le déploiement du code, permettant des livraisons plus rapides et fiables.
* **Client (Utilisateur)** : Personne ou entité qui utilise les services de ColisApp pour envoyer ou recevoir des colis.
* **Cloudinary** : Plateforme de gestion d'images et de vidéos basée sur le cloud, utilisée pour stocker, manipuler et livrer des médias.
* **ColisApp** : Nom de l'application de gestion des envois et de la logistique développée.
* **Coupon** : Code promotionnel offrant une réduction sur le prix d'un envoi.
* **Docker** : Plateforme permettant de développer, déployer et exécuter des applications dans des conteneurs isolés, garantissant la cohérence de l'environnement.
* **DTO (Data Transfer Object)** : Objet utilisé pour transporter des données entre les processus ou les couches d'une application, souvent pour structurer les données échangées via une API.
* **Envoi (Shipment)** : Terme désignant un colis ou un ensemble de colis pris en charge par ColisApp pour être transporté d'un point A à un point B.
* **ESLint** : Outil d'analyse statique de code JavaScript/TypeScript, utilisé pour identifier les problèmes de programmation, les erreurs et les non-conformités aux conventions de style.
* **Frontend** : Partie d'une application avec laquelle l'utilisateur interagit directement (interface utilisateur).
* **Full-stack** : Désigne un développeur ou une application qui couvre à la fois le développement frontend et backend.
* **Git** : Système de contrôle de version distribué, utilisé pour suivre les modifications du code source pendant le développement logiciel.
* **GitHub** : Plateforme d'hébergement de dépôts Git, offrant des fonctionnalités de collaboration, de gestion de projet et de CI/CD.
* **JWT (JSON Web Token)** : Standard ouvert et compact pour créer des jetons d'accès sécurisés entre deux parties, souvent utilisé pour l'authentification et l'autorisation.
* **MCD (Modèle Conceptuel de Données)** : Représentation abstraite des données d'un système, décrivant les entités, leurs attributs et les relations entre elles, indépendamment de toute implémentation technique.
* **Middleware** : Logiciel qui fournit des services aux applications au-delà de ceux offerts par le système d'exploitation, souvent utilisé pour intercepter et traiter les requêtes HTTP.
* **MLD (Modèle Logique de Données)** : Représentation des données organisées en tables et colonnes, avec des clés primaires et étrangères, prête à être implémentée dans un système de gestion de base de données relationnelle.
* **MPD (Modèle Physique de Données)** : Représentation concrète de la base de données, incluant les types de données spécifiques, les contraintes d'intégrité, les index et les optimisations de performance.
* **Next.js** : Framework React pour la construction d'applications web full-stack, offrant des fonctionnalités comme le rendu côté serveur (SSR), la génération de sites statiques (SSG) et les API routes.
* **Nginx** : Serveur web et proxy inverse léger et performant, souvent utilisé pour servir des fichiers statiques, équilibrer la charge et gérer les requêtes HTTP.
* **Node.js** : Environnement d'exécution JavaScript côté serveur, permettant de construire des applications backend scalables.
* **Notification** : Message ou alerte envoyé à l'utilisateur pour l'informer d'un événement important (ex: changement de statut d'un envoi).
* **ORM (Object-Relational Mapping)** : Technique de programmation qui convertit les données entre des systèmes de types incompatibles en utilisant des langages de programmation orientés objet.
* **Paiement** : Processus de transaction financière pour régler les frais d'un envoi.
* **PostgreSQL** : Système de gestion de base de données relationnelle open-source, réputé pour sa robustesse, sa fiabilité et ses fonctionnalités avancées.
* **Prisma ORM** : Outil de base de données de nouvelle génération qui simplifie l'accès aux bases de données et la gestion des schémas, offrant une API type-safe pour les requêtes.
* **Prettier** : Formatteur de code qui applique un style de code cohérent en analysant le code et en le réécrivant selon des règles prédéfinies.
* **React** : Bibliothèque JavaScript pour la construction d'interfaces utilisateur interactives et réutilisables.
* **Rôle** : Attribut d'un utilisateur définissant ses permissions et son niveau d'accès au sein de l'application (ex: CLIENT, SUPER_ADMIN, AGENCY_ADMIN).
* **Simulation** : Fonctionnalité permettant à l'utilisateur d'estimer le coût et les délais d'un envoi avant de le confirmer.
* **SQL (Structured Query Language)** : Langage standardisé utilisé pour gérer et manipuler des bases de données relationnelles.
* **Stripe** : Plateforme de traitement des paiements en ligne, permettant aux entreprises d'accepter des paiements par carte de crédit et autres méthodes.
* **Swagger/OpenAPI** : Spécification standard pour décrire les API RESTful, permettant de générer de la documentation interactive et des clients API.
* **Suivi (Tracking)** : Fonctionnalité permettant de suivre en temps réel l'état et la localisation d'un envoi.
* **Tailwind CSS** : Framework CSS utilitaire qui permet de construire rapidement des interfaces utilisateur personnalisées en utilisant des classes CSS prédéfinies.
* **Tarifs** : Structure de prix appliquée aux différents types d'envois et services.
* **TypeScript** : Sur-ensemble de JavaScript qui ajoute le typage statique, améliorant la robustesse du code et la productivité des développeurs.
* **UI (User Interface)** : L'ensemble des éléments graphiques, textuels et interactifs avec lesquels un utilisateur interagit dans une application.
* **UX (User Experience)** : L'expérience globale d'un utilisateur lorsqu'il interagit avec un produit ou un service, incluant l'utilisabilité, l'accessibilité et le plaisir.
