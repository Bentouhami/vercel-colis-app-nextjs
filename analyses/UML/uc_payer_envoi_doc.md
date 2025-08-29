### Diagramme Détaillé - UC: Payer l'envoi via Stripe

**Fichier :** `analyses/UML/uc_payer_envoi.puml`

| Cas d'Utilisation | Description |
| :---------------- | :---------- |
| Payer l'envoi | Le cas d'utilisation principal pour effectuer le paiement d'un envoi. |
| Créer une session de paiement Stripe | Le système crée une session de paiement sécurisée avec Stripe. |
| Rediriger vers Stripe | Le client est redirigé vers la page de paiement sécurisée de Stripe. |
| Traiter le résultat du paiement | Le système traite la réponse de Stripe après la tentative de paiement. |
| Mettre à jour le statut de l'envoi | Le statut de l'envoi est mis à jour en fonction du résultat du paiement. |
| Recevoir la confirmation de l'envoi | Le client reçoit une confirmation de l'envoi après un paiement réussi. |