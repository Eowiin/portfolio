import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProjectGallery } from "@/components/project-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cinemap } from "@/data/projects";
import listCapture from "@/assets/cinemap/list.webp";

export const metadata: Metadata = {
  title: "Cinemap",
  description:
    "Étude de cas Cinemap : la carte des cinémas de France et de leurs séances, avec un backend Rust et une PWA Svelte, par Ethan Saux.",
  openGraph: {
    title: "Cinemap — Étude de cas",
    description:
      "Ce qui passe près de chez soi, où voir un film et à quelle heure. Plus de 3 000 cinémas en France, séances mises à jour chaque nuit.",
  },
};

const features = [
  "Une carte de plus de 3 000 cinémas en France",
  "Les séances de la semaine, mises à jour chaque nuit",
  "Filtres VF ou VO, horaire et cinémas favoris",
  "Cinémas acceptant UGC Illimité ou Pathé CinéPass",
  "Un programme de la journée composé à partir de 1 à 4 films",
  "Une app installable, sans compte, partageable par lien",
];

function CaseActions({ centered = false }: { centered?: boolean }) {
  return (
    <div className={`case-actions${centered ? " case-actions--centered" : ""}`}>
      <a
        className="button button--accent"
        href={cinemap.links.website}
        target="_blank"
        rel="noreferrer"
      >
        Ouvrir Cinemap ↗
      </a>
      {cinemap.links.source && (
        <a
          className="button button--accent-outline"
          href={cinemap.links.source}
          target="_blank"
          rel="noreferrer"
        >
          Voir le code sur GitHub ↗
        </a>
      )}
    </div>
  );
}

export default function CinemapPage() {
  return (
    <div id="top" className="case-page theme-cinemap">
      <SiteHeader />
      <main id="contenu">
        <nav className="case-navigation shell" aria-label="Retour aux projets">
          <Link className="back-link" href="/#projets">
            ← Tous les projets
          </Link>
        </nav>
        <section className="case-hero shell" aria-labelledby="case-title">
          <div className="case-hero__copy entrance">
            <p className="eyebrow eyebrow--accent">Cinemap · Étude de cas</p>
            <h1 id="case-title">Toutes les séances de cinéma, sur une carte.</h1>
            <p>{cinemap.summary}</p>
            <CaseActions />
          </div>

          <div className="case-hero__visual entrance entrance--delayed">
            <div className="case-phone">
              <div className="case-phone__speaker" aria-hidden="true" />
              <div className="case-phone__screen">
                <Image
                  className="case-phone__capture"
                  src={listCapture}
                  alt="Cinemap, films à l’affiche autour de Paris avec la prochaine séance"
                  unoptimized
                  preload
                  placeholder="blur"
                />
              </div>
            </div>
          </div>

          <dl className="case-facts">
            <div>
              <dt>Couverture</dt>
              <dd>3 000+ cinémas en France</dd>
            </div>
            <div>
              <dt>Plateforme</dt>
              <dd>Web et PWA installable</dd>
            </div>
            <div>
              <dt>Frontend</dt>
              <dd>Svelte 5 et MapLibre</dd>
            </div>
            <div>
              <dt>Backend</dt>
              <dd>Rust et SQLite</dd>
            </div>
            <div>
              <dt>Publication</dt>
              <dd>En ligne depuis octobre 2026</dd>
            </div>
          </dl>
        </section>

        <section className="case-section shell" aria-labelledby="features-title">
          <div className="case-section__heading">
            <p className="eyebrow eyebrow--accent">Fonctionnalités</p>
            <h2 id="features-title">Du film qui donne envie à la séance réservée.</h2>
          </div>
          <ol className="feature-list">
            {features.map((feature, index) => (
              <li key={feature}>
                <span aria-hidden="true">0{index + 1}</span>
                <p>{feature}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="role-section shell" aria-labelledby="role-title">
          <div className="role-section__panel">
            <p className="eyebrow">Rôle</p>
            <h2 id="role-title">De la donnée brute au site en ligne.</h2>
            <p>
              J’ai conçu Cinemap et écrit son backend en Rust : collecte des
              séances, enrichissement des fiches films, API, pages rendues côté
              serveur, puis déploiement continu sur un VPS.
            </p>
          </div>
          <div className="result-block">
            <p className="eyebrow eyebrow--accent">En chiffres</p>
            <strong>3 100+</strong>
            <p className="result-block__label">cinémas référencés en France</p>
            <strong>7 jours</strong>
            <p className="result-block__label">de séances consultables à l’avance</p>
            <strong>0 cookie</strong>
            <p className="result-block__label">mesure d’audience sans identifiant</p>
          </div>
        </section>

        <section className="technical-section shell" aria-labelledby="technical-title">
          <p className="eyebrow eyebrow--accent">Défi technique</p>
          <h2 id="technical-title">Des séances justes pour 3 000 cinémas.</h2>
          <p>
            Chaque cinéma est rattaché à son identifiant AlloCiné plutôt
            qu’à un rapprochement par nom, ce qui évite d’afficher les séances
            d’un UGC sur un autre. Les cinémas sont géolocalisés avec l’API
            Adresse et croisés avec les données du CNC.
          </p>
          <p>
            Chaque nuit, le backend relit toutes les pages de séances, page
            par page et à un rythme modéré, puis complète les films avec TMDB
            pour les affiches, les synopsis et le casting.
          </p>
        </section>

        <section className="technical-section shell" aria-labelledby="architecture-title">
          <p className="eyebrow eyebrow--accent">Architecture</p>
          <h2 id="architecture-title">Un binaire Rust, une base SQLite, une PWA.</h2>
          <p>
            Un seul binaire Rust (axum, sqlx, reqwest) sert l’API JSON, les
            pages HTML des films, cinémas et villes, et le sitemap. Les données
            tiennent dans SQLite ; les scrapers tournent via des timers systemd
            derrière nginx.
          </p>
          <p>
            Le front est une PWA Svelte 5 avec une carte MapLibre. Favoris et
            programme restent dans le navigateur, sans compte. Chaque push sur
            main passe la CI GitHub Actions puis part en production.
          </p>
        </section>

        <section className="gallery-section" aria-labelledby="gallery-title">
          <div className="gallery-section__heading shell">
            <p className="eyebrow eyebrow--accent">Dans le produit</p>
            <h2 id="gallery-title">Parcourir, situer, choisir, y aller.</h2>
            <p>
              Les écrans clés pour passer d’une envie de cinéma à une séance
              précise, près de chez soi.
            </p>
          </div>
          <ProjectGallery projectName={cinemap.name} images={cinemap.images} />
        </section>

        <section className="case-cta" aria-labelledby="case-cta-title">
          <div className="shell case-cta__inner">
            <p className="eyebrow eyebrow--accent">Essayer Cinemap</p>
            <h2 id="case-cta-title">Qu’est-ce qui passe près de chez vous&nbsp;?</h2>
            <CaseActions centered />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
