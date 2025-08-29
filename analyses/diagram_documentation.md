## Annexe A : Documentation des Diagrammes UML

---

### Diagramme de Cas d'Utilisation - Processus de Simulation (Basé sur le Code)

**Fichier :** `analyses/UML/uc_detail_simulation_code_based.puml`

| Cas d'Utilisation | Description |
| :---------------- | :---------- |
| Lancer le processus de simulation (UC_Start) | L'utilisateur initie le processus de simulation d'envoi. |
| Gérer une simulation existante (UC_ManageOld) | Le système détecte et propose de gérer une simulation précédemment commencée. |
| Continuer la simulation (UC_Continue) | L'utilisateur choisit de reprendre une simulation existante. |
| Créer une nouvelle simulation (UC_CreateNew) | L'utilisateur choisit de démarrer une toute nouvelle simulation. |
| Saisir les informations de l'envoi (UC_Input) | L'utilisateur fournit toutes les informations nécessaires pour l'envoi. |
| Définir le lieu de départ (UC_SetDeparture) | L'utilisateur spécifie l'adresse de départ du colis. |
| Définir le lieu de destination (UC_SetDestination) | L'utilisateur spécifie l'adresse de destination du colis. |
| Définir les détails des colis (UC_SetParcels) | L'utilisateur fournit les informations sur les colis (poids, dimensions, etc.). |
| Soumettre la simulation pour calcul (UC_Submit) | L'utilisateur envoie les données de simulation pour obtenir un calcul de tarif. |
| Valider les données saisies (UC_Validate) | Le système vérifie la validité et la cohérence des informations fournies par l'utilisateur. |
| Consulter les résultats (UC_ViewResults) | L'utilisateur visualise les tarifs et options d'envoi calculés. |
