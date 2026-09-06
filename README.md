# Portfolio — Ethan Saux

Portfolio personnel d’Ethan Saux, développeur full-stack freelance. Le site présente les projets, le profil et les moyens de contact, avec une étude de cas dédiée à Songspot, un jeu de blind test musical.

## Stack

- Next.js 16 avec App Router et React 19.
- TypeScript.
- CSS global et Tailwind CSS 4 via PostCSS.
- ESLint pour l’analyse du code.

Le contenu est défini dans le dépôt. Le portfolio ne nécessite ni base de données ni service backend séparé.

## Développement local

Prérequis : Node.js 20.9 minimum et npm.

```bash
npm ci
npm run dev
```

Le site est accessible sur [localhost:3000](http://localhost:3000).

Sans configuration supplémentaire, les URL du site utilisent `http://localhost:3000`. Pour définir une autre adresse, créer un fichier `.env.local` :

```dotenv
NEXT_PUBLIC_SITE_URL=https://portfolio.example.com
```

Utiliser une URL complète, sans slash final. Cette valeur sert aux métadonnées, au sitemap et au fichier `robots.txt`. Le fichier `.env.example` décrit la variable ; si vous le copiez, renseignez la valeur avant de lancer le site : une chaîne vide ne déclenche pas la valeur par défaut.

## Commandes

| Commande | Usage |
| --- | --- |
| `npm run dev` | Lancer le serveur de développement avec Webpack. |
| `npm run build` | Générer la version de production avec Webpack. |
| `npm start` | Servir la version de production après le build. |
| `npm run lint` | Vérifier le code avec ESLint. |
| `npm run typecheck` | Vérifier les types TypeScript. |

Sur une installation neuve, générer les types Next.js avant de lancer la vérification TypeScript :

```bash
npx next typegen
npm run lint
npm run typecheck
```

## Organisation du projet

```text
src/
  app/
    page.tsx                 Page d’accueil
    layout.tsx               Structure commune et métadonnées
    globals.css              Styles et responsive
    projects/songspot/       Étude de cas Songspot
    opengraph-image.tsx       Image de partage social
    robots.ts                Règles d’indexation
    sitemap.ts               Liste des pages à indexer
  components/                En-tête, pied de page, cartes et galerie
  data/
    site.ts                  Identité, description et liens de contact
    projects.ts              Données, captures et liens des projets
public/images/songspot/      Visuels utilisés sur le site
```

Pour modifier les coordonnées ou la présentation générale, éditer `src/data/site.ts`. Les informations et captures des projets se trouvent dans `src/data/projects.ts` ; le texte détaillé de Songspot est dans `src/app/projects/songspot/page.tsx`.

L’ajout d’une nouvelle page projet nécessite aussi de mettre à jour `src/app/sitemap.ts`.

## Production

Configurer `NEXT_PUBLIC_SITE_URL` avec le domaine public **avant le build**, puis exécuter :

```bash
npm ci
npm run build
npm start
```

Le serveur écoute par défaut sur le port 3000. La variable `PORT` permet de choisir un autre port. Pour un hébergement sur serveur, placer le processus derrière un reverse proxy HTTPS et le gérer avec un gestionnaire de services.

## Fichiers versionnés

Le dépôt contient le code, les configurations, `package-lock.json`, `.env.example` et les visuels utilisés.

Les dépendances, builds, fichiers d’environnement locaux, archives et fichiers de travail sont exclus via `.gitignore`. Le dossier local `local-assets/`, également ignoré, conserve les captures inutilisées hors de `public/`. `next-env.d.ts` est généré par Next.js.
