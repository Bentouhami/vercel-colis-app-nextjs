# Log du Problème de Migration Prisma - 16 juillet 2025

Ce document résume le problème de "schema drift" rencontré lors de la tentative d'ajout du modèle `Guest` et la solution envisagée.

## 1. Le Problème

En tentant d'exécuter la commande `npx prisma migrate dev --name guest_and_gender_added`, une erreur s'est produite :

**"Drift detected: Your database schema is not in sync with your migration history."**

L'analyse de Prisma a révélé que de nombreuses tables de la base de données de développement contenaient une colonne `isDeleted` qui n'était pas enregistrée dans l'historique des migrations. Cela signifie que le schéma réel de la base de données a divergé de ce que Prisma attendait.

## 2. La Cause Probable

Des modifications manuelles ont probablement été apportées à la base de données sans passer par le système de migration de Prisma, créant ainsi une désynchronisation.

## 3. La Solution Retenue

La solution recommandée par Prisma et que nous avons acceptée est de réinitialiser la base de données de développement.

**Action Planifiée :**

1.  **Exécuter `npx prisma migrate reset` :** Cette commande va supprimer complètement la base de données de développement et la recréer en appliquant toutes les migrations existantes depuis le début. **Attention : Toutes les données de développement actuelles seront perdues.**
2.  **Ré-exécuter `npx prisma migrate dev` :** Une fois la base de données propre et synchronisée, nous pourrons relancer la migration pour ajouter les nouvelles fonctionnalités (modèle `Guest`, etc.).

Ce plan d'action sera repris lors de la prochaine session de travail.
