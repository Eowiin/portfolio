export type ProjectImage = {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  name: string;
  category: string;
  logo: string;
  /** Chiffre clé affiché sur la carte de l’accueil. */
  metric: string;
  appStoreAchievement?: {
    value: string;
    label: string;
  };
  platforms: string[];
  technologies: string[];
  publishedAt: string;
  summary: string;
  images: ProjectImage[];
  links: {
    appStore?: string;
    playStore?: string;
    website: string;
    source?: string;
  };
};

export const projects: Project[] = [
  {
    slug: "songspot",
    name: "Songspot",
    category: "Blind test musical",
    logo: "/images/songspot/logo.png",
    metric: "50 000+ inscrits",
    appStoreAchievement: {
      value: "Top 7",
      label: "atteint dans la catégorie Musique de l’App Store",
    },
    platforms: ["iOS", "Android", "Web"],
    technologies: ["Flutter", "Django"],
    publishedAt: "mars 2026",
    summary:
      "Songspot est une application de blind test disponible sur mobile et sur le web. Les joueurs écoutent un extrait, identifient le morceau et tentent d’enchaîner les bonnes réponses pour améliorer leur score.",
    images: [
      {
        src: "/images/songspot/gameplay.svg",
        alt: "Partie solo Songspot avec écoute d’un extrait et saisie du titre",
        label: "Écouter & deviner",
        width: 963,
        height: 2083,
      },
      {
        src: "/images/songspot/playlists.svg",
        alt: "Sélection d’une playlist musicale dans Songspot",
        label: "Choisir une playlist",
        width: 963,
        height: 2084,
      },
      {
        src: "/images/songspot/artists.svg",
        alt: "Sélection d’un artiste favori dans Songspot",
        label: "Jouer son artiste",
        width: 963,
        height: 2085,
      },
      {
        src: "/images/songspot/duel.svg",
        alt: "Duel Songspot en temps réel entre deux joueurs",
        label: "S’affronter en direct",
        width: 963,
        height: 2083,
      },
      {
        src: "/images/songspot/results.svg",
        alt: "Résultats d’une partie Songspot avec score, série et précision",
        label: "Dépasser son score",
        width: 963,
        height: 2084,
      },
      {
        src: "/images/songspot/stats.svg",
        alt: "Accueil Songspot avec progression, records et modes de jeu",
        label: "Suivre sa progression",
        width: 963,
        height: 2084,
      },
    ],
    links: {
      appStore:
        "https://apps.apple.com/us/app/songspot-music-quiz/id6758571545",
      playStore:
        "https://play.google.com/store/apps/details?id=com.songspot.app",
      website: "https://songspot.eowinstudio.com/",
    },
  },
  {
    slug: "cinemap",
    name: "Cinemap",
    category: "Carte des séances de cinéma",
    logo: "/images/cinemap/logo.svg",
    metric: "3 000+ cinémas en France",
    platforms: ["Web", "PWA"],
    technologies: ["Rust", "Svelte"],
    publishedAt: "octobre 2026",
    summary:
      "Cinemap réunit sur une carte plus de 3 000 cinémas français et leurs séances de la semaine. On y trouve ce qui passe près de chez soi, où voir un film et à quelle heure, puis on compose son programme de la journée.",
    images: [
      {
        src: "/images/cinemap/list.webp",
        alt: "Films à l’affiche autour de Paris avec le nombre de cinémas et la prochaine séance",
        label: "Voir ce qui passe",
        width: 963,
        height: 2088,
      },
      {
        src: "/images/cinemap/map.webp",
        alt: "Carte des cinémas d’Île-de-France regroupés par zone",
        label: "Explorer la carte",
        width: 963,
        height: 2088,
      },
      {
        src: "/images/cinemap/film.webp",
        alt: "Fiche film Cinemap avec affiche, notes, casting et séances à proximité",
        label: "Choisir son film",
        width: 963,
        height: 2088,
      },
      {
        src: "/images/cinemap/cinema.webp",
        alt: "Fiche cinéma Cinemap avec cartes acceptées et séances du jour",
        label: "Trouver sa séance",
        width: 963,
        height: 2088,
      },
    ],
    links: {
      website: "https://cinemap.ethansaux.fr/",
      source: "https://github.com/Eowiin/Cinemap",
    },
  },
];

export const songspot = getProject("songspot");
export const cinemap = getProject("cinemap");

function getProject(slug: string): Project {
  const project = projects.find((candidate) => candidate.slug === slug);
  if (!project) throw new Error(`Projet inconnu : ${slug}`);
  return project;
}
