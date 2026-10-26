# 🎮 Gaming Companion - Guide de Lancement sur votre Bureau

Félicitations ! Vous avez téléchargé le projet sur votre ordinateur.

## 🚀 Démarrage Rapide (En 2 minutes)

### 1. Prérequis
Assurez-vous d'avoir installé **Node.js** (version 18 ou supérieure) :
- Téléchargeable gratuitement sur : [https://nodejs.org](https://nodejs.org)

### 2. Installation des dépendances
Ouvrez votre terminal (Invite de commandes, PowerShell ou Terminal Mac/Linux) dans ce dossier et tapez :

```bash
npm install
```

### 3. Lancer l'application
Démarrez le serveur de développement local :

```bash
npm run dev
```

L'application s'ouvrira immédiatement dans votre navigateur à l'adresse :
👉 **http://localhost:3000**

---

## 🛠️ Structure du Projet

- `src/components/` : Composants de l'application (Vues, Radar HUD, Terminal Stripe/Paiement, Cartes, etc.)
- `src/components/CheckoutTerminal.tsx` : Terminal bancaire cyberpunk avec redirection personnalisable vers Stripe ou Lemon Squeezy.
- `src/context/` : Gestion des états globaux (profils de jeu, missions, collectibles, progression).
- `src/data/` : Données de démonstration et profils (Cyberpunk 2077, Elden Ring, GTA VI).

### 🐉 Module « Pré-production v3 »

L'onglet **Pré-prod** restitue le document de cadrage v3 (MVP) sous forme de tableau de bord :

- `src/data/specV3.ts` : contenu typé du document (vision APAC, boucle d'incubation, véhicules, 15 compagnons / 45 variantes, raids, monétisation, architecture, onboarding, KPIs, roadmap). Les noms de compagnons et les valeurs de bonus sont des propositions d'équilibrage : le document fixe les raretés (55 / 30 / 12 / 2,9 / 0,1 %), pas les noms.
- `src/components/views/SpecView.tsx` : vue à 10 sections, avec deux simulateurs (incubation −3 min par course et compteur de Pity).

Vérification rapide du module (rendu de chaque section + cohérence des données) :

```bash
npm run check:spec
```


---

## 📦 Construire la version de production

Pour générer le build optimisé prêt à être hébergé sur le web (Vercel, Netlify, Cloudflare Pages, etc.) :

```bash
npm run build
```
Les fichiers prêts pour le déploiement se trouveront dans le dossier `dist/`.
