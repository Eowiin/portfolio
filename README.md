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

## Production : GitHub Actions → GHCR privé → VPS

Le portfolio est en ligne sur **https://eowinstudio.com**. Le VPS sert le site via
Nginx et un certificat Let’s Encrypt renouvelé automatiquement par Certbot.

Le workflow `.github/workflows/deploy.yaml` construit le portfolio sur GitHub à
chaque push sur `main` (ou lancement manuel), puis le déploie via SSH. Le VPS ne
compile rien. Les étapes sont : lint, tests du déploiement, build Next.js avec
vérification TypeScript, publication GHCR, téléchargement sur le VPS et contrôle
de santé. Le build cible x86_64, l’architecture du VPS actuel. La variable de dépôt
optionnelle `IMAGE_PLATFORM=linux/arm64` permettrait de cibler un futur VPS ARM.

L’image est `ghcr.io/eowiin/portfolio:sha-<commit>`. Le déploiement utilise son
**digest immuable** `ghcr.io/eowiin/portfolio@sha256:…`, pas un tag `latest`.
Le cache des couches Docker est stocké dans le même package GHCR privé, sous le
tag `buildcache`. Les dépendances sont réutilisées lorsque le lockfile ne change
pas. Aucun fichier `.env`, clé SSH ou archive locale n’entre dans le build.

### Confidentialité et rétention

Un package GHCR **existant et vérifié privé** est obligatoire avant tout envoi du
code ou du cache. Le workflow refuse aussi les packages absents : il ne suppose
plus que la première publication aura la bonne visibilité. Le premier essai du
6 septembre 2026 a exposé l’image ; le contrôle après publication a bloqué le
déploiement, mais ne suffisait pas à empêcher cette exposition.

Créer d’abord un package avec une image vide, sans code ni cache du projet, et
vérifier dans GitHub Packages que sa visibilité est **Private**. Configurer son
accès Actions explicitement pour `Eowiin/portfolio`, sans héritage d’accès du
dépôt public. Le workflow n’ajoute pas de label de liaison automatique au dépôt.
La publication utilise ensuite son `GITHUB_TOKEN` temporaire. Un package déjà
public doit être supprimé et recréé : GitHub ne permet pas de le rendre privé.

Après un déploiement réussi, le nettoyage garde les dix versions taguées par
commit les plus récentes **et les digests des versions actuelle et précédente**.
Il ignore `buildcache`, les tags étrangers et les manifests sans tag, qui peuvent
être nécessaires aux images multiarchitectures. Il ne garantit donc pas un
plafond de stockage. Un refus de suppression GHCR signale un avertissement sans
invalider un déploiement réussi. Aucun nettoyage global de Docker n’est exécuté
sur le VPS partagé.

### Initialisation unique du package privé

L’ancien package public a été supprimé. Le workflow d’initialisation se lance
**manuellement uniquement** et ne supprime plus aucun package.

1. Créer un PAT GitHub **classic** avec `write:packages`, sans accès `repo` ni
   `delete:packages`, depuis
   <https://github.com/settings/tokens/new?scopes=write:packages>.
2. L’ajouter comme secret `GHCR_BOOTSTRAP_TOKEN` dans l’environnement GitHub
   `production` du dépôt.
3. Lancer **Initialize private portfolio registry** depuis Actions. Ce workflow
   envoie uniquement une image `FROM scratch`, sans code ni cache du portfolio,
   puis vérifie que le package est privé. L’utilisation d’un PAT évite la liaison
   automatique au dépôt public faite par le `GITHUB_TOKEN` lors de la création.
4. Dans les paramètres du package privé, sous **Manage Actions access**, ajouter
   `Eowiin/portfolio` avec le rôle **Admin** (nécessaire au nettoyage des anciennes
   versions). Ne pas activer l’héritage des permissions du dépôt public.
5. Révoquer le PAT d’initialisation et supprimer le secret `GHCR_BOOTSTRAP_TOKEN`.
   Les déploiements courants utilisent exclusivement le `GITHUB_TOKEN` automatique.

Le déploiement transmet le `GITHUB_TOKEN` temporaire au VPS par l’entrée standard
SSH. Docker utilise un dossier d’authentification temporaire, supprimé à la fin
(même si le déploiement échoue). Aucun PAT permanent supplémentaire n’est requis
sur le VPS et les identifiants Docker des autres projets ne sont pas modifiés.

### Configuration GitHub

Dans le dépôt `Eowiin/portfolio`, configurer la variable de dépôt :

| Variable de dépôt | Valeur |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://eowinstudio.com` |

Créer l’environnement GitHub **production**, puis y configurer :

| Variable d’environnement | Valeur |
| --- | --- |
| `VPS_PATH` | `/opt/portfolio` |
| `VPS_PORT` | `22` (défaut) |

| Secret de l’environnement | Contenu |
| --- | --- |
| `VPS_HOST` | `77.42.85.235` |
| `VPS_USER` | Utilisateur SSH autorisé à gérer le portfolio et Docker. |
| `VPS_SSH_KEY` | Clé privée dédiée au déploiement ; installer sa clé publique dans `authorized_keys` de cet utilisateur. |
| `VPS_KNOWN_HOSTS` | Entrée SSH vérifiée pour `77.42.85.235`. |

La connexion locale `ssh songspot` utilise actuellement `root`. Une clé dédiée
permet de révoquer l’accès CI séparément de la clé personnelle. Ne pas committer
ces secrets. Pour obtenir l’entrée déjà approuvée localement :

```bash
ssh-keygen -F 77.42.85.235
```

Copier la ligne de clé hôte (pas le commentaire). Ne pas désactiver la vérification
SSH ; si la clé du serveur change, vérifier son empreinte avant de remplacer le
secret. Le workflow ne fait pas confiance à un `ssh-keyscan` effectué à la volée.

### Préparer le VPS une seule fois

Prérequis : Docker Engine, Compose avec `--wait`, Bash, `flock` et GNU coreutils.
Le dossier `/opt/portfolio/releases` et le fichier `/opt/portfolio/.env` ont été
préparés sous `root` sur le VPS actuel. Si un autre utilisateur est choisi, lui
attribuer ces dossiers. Le fichier `.env` contient :

```dotenv
PORTFOLIO_PORT=3001
PORTFOLIO_CPUS=1.0
PORTFOLIO_MEMORY=512m
```

L’authentification GHCR est fournie temporairement par le workflow au moment du
déploiement. Le VPS n’a pas besoin d’un login Docker permanent pour le portfolio,
ni du code source, de Node.js ou d’un accès Git au dépôt.

Une fois la configuration GitHub et l’accès Actions au package prêts, pousser sur `main` ou
lancer **Build and deploy portfolio** dans Actions.

### Domaine et HTTPS sur le VPS actuel

Nginx est déjà installé pour Songspot et les autres services. Le portfolio publie
seulement `127.0.0.1:3001`. Le fichier `deploy/nginx.conf` contient un serveur dédié
à `eowinstudio.com`. Sur le VPS actuel, le site est déjà activé avec HTTPS.
Les commandes suivantes servent uniquement à préparer un **nouveau VPS**, après
son premier déploiement réussi :

```bash
sudo cp /opt/portfolio/nginx.conf /etc/nginx/sites-available/portfolio
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
sudo nginx -t && sudo systemctl reload nginx
```

Le fichier `/opt/portfolio/nginx.conf` est le modèle HTTP initial. La configuration
active `/etc/nginx/sites-available/portfolio` contient les ajouts HTTPS de Certbot :
ne pas l’écraser avec le modèle HTTP. Le DNS A pointe vers `77.42.85.235`.
Sur un nouveau serveur, faire pointer le DNS vers sa propre IP, corriger tout AAAA
inadapté, puis activer HTTPS après propagation :

```bash
sudo certbot --nginx -d eowinstudio.com
```

La configuration ne réclame pas `www`. Pour l’ajouter, prévoir son DNS, son nom
Nginx et son certificat. Les configurations des autres sites restent distinctes.

### Déploiement et retour arrière

Le workflow copie uniquement Compose et le script dans un dossier de version
`/opt/portfolio/releases/<commit>-<run>-<attempt>`. Il télécharge l’image avant de
remplacer le conteneur et attend son état sain. Un échec de téléchargement laisse
le site actif. Si le démarrage échoue, le script tente de relancer la version
précédente et fait échouer le workflow. Lors du tout premier déploiement, il n’y a
pas encore de version de secours. Une courte interruption reste possible.

Les liens `/opt/portfolio/current` et `/opt/portfolio/previous` permettent de
retrouver les deux dernières versions réussies. Un verrou évite deux déploiements
simultanés. Pour revenir manuellement à la précédente :

```bash
release=$(readlink -f /opt/portfolio/previous)
image=$(sed -n 's/^PORTFOLIO_IMAGE=//p' "$release/image.env")
bash "$release/scripts/deploy.sh" /opt/portfolio "$release" "$image"
```

Le retour arrière réutilise l’image locale si elle est présente. Si elle a été
supprimée du VPS, un login GHCR valide sera nécessaire pour la télécharger.
Chaque version conserve son Compose et son digest. Le fichier `.env` des limites
reste commun. Les anciens dossiers et images Docker locaux sont conservés ; ne
pas lancer de `docker system prune` global sur le VPS partagé sans vérifier les
besoins des autres projets.

### Ressources et exploitation

Les plafonds initiaux sont **1 CPU et 512 Mo de RAM**, ajustables dans
`/opt/portfolio/.env`. Ils ne réservent pas les ressources. Le CPU est ralenti au
plafond ; un dépassement mémoire peut provoquer un arrêt et un redémarrage.
Modifier les limites ne demande pas de reconstruire l’image. Exemple pour
appliquer les changements et suivre le service :

```bash
cd /opt/portfolio
# image.env complète .env avec le digest réellement déployé.
docker compose --env-file .env --env-file current/image.env -f current/compose.yaml up -d --no-build --wait
docker compose --env-file .env --env-file current/image.env -f current/compose.yaml logs --tail=100 -f
docker compose --env-file .env --env-file current/image.env -f current/compose.yaml stats
```

Le conteneur redémarre après un plantage ou un reboot, sauf arrêt volontaire. Un
état `unhealthy` seul ne déclenche pas de redémarrage. Les logs tournent sur trois
fichiers de 10 Mo. Le cache d’images Next.js est recréé au remplacement du
conteneur ; aucun volume de données n’est requis par le portfolio actuel.

### Construction Docker locale facultative

Le Compose de production n’a aucune instruction de build. Pour tester localement,
copier `.env.example` vers `.env`, puis utiliser l’extension dédiée :

```bash
PORTFOLIO_IMAGE=portfolio-local:dev docker compose -f compose.yaml -f compose.build.yaml up -d --build --wait
```

L’URL publique est intégrée au build ; la changer nécessite une nouvelle image.

Références : [cache Docker dans GitHub Actions](https://docs.docker.com/build/ci/github-actions/cache/),
[GHCR privé et authentification](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

## Fichiers versionnés

Le dépôt contient le code, les configurations, `package-lock.json`, `.env.example` et les visuels utilisés.

Les dépendances, builds, fichiers d’environnement locaux, archives et fichiers de travail sont exclus via `.gitignore`. Le dossier local `local-assets/`, également ignoré, conserve les captures inutilisées hors de `public/`. `next-env.d.ts` est généré par Next.js.
