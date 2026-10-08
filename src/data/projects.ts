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
  registeredUsers: string;
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
    appStore: string;
    playStore: string;
    website: string;
  };
};

export const projects: Project[] = [
  {
    slug: "songspot",
    name: "Songspot",
    category: "Blind test musical",
    registeredUsers: "50 000+ inscrits",
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
];

export const songspot = projects[0];
