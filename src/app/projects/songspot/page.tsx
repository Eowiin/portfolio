import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProjectGallery } from "@/components/project-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { songspot } from "@/data/projects";

export const metadata: Metadata = {
  title: "Songspot",
  description:
    "Étude de cas Songspot : un blind test musical mobile et web conçu et développé de bout en bout par Ethan Saux.",
  openGraph: {
    title: "Songspot — Étude de cas",
    description:
      "Le blind test musical, à jouer seul ou en duel. 30 000+ inscrits sur iOS, Android et le Web.",
  },
};

const features = [
  "Plus de 14 genres musicaux",
  "Parties centrées sur un artiste",
  "Trois niveaux de difficulté",
  "Suivi des scores, séries et chansons jouées",
  "Mode 1v1 en temps réel avec classement ELO",
];

export default function SongspotPage() {
  return (
    <div id="top" className="case-page">
      <SiteHeader />
      <main id="contenu">
        <nav className="case-navigation shell" aria-label="Retour aux projets">
          <Link className="back-link" href="/#projets">
            ← Tous les projets
          </Link>
        </nav>
        <section className="case-hero shell" aria-labelledby="case-title">
          <div className="case-hero__copy entrance">
            <p className="eyebrow eyebrow--purple">Songspot · Étude de cas</p>
            <h1 id="case-title">Le blind test musical, à jouer seul ou en duel.</h1>
            <p>{songspot.summary}</p>
            <div className="case-actions">
              <a
                className="button button--purple"
                href={songspot.links.appStore}
                target="_blank"
                rel="noreferrer"
              >
                Voir sur l’App Store ↗
              </a>
              <a
                className="button button--purple-outline"
                href={songspot.links.playStore}
                target="_blank"
                rel="noreferrer"
              >
                Voir sur Google Play ↗
              </a>
              <a
                className="text-link case-actions__website"
                href={songspot.links.website}
                target="_blank"
                rel="noreferrer"
              >
                Découvrir Songspot ↗
              </a>
            </div>
          </div>

          <div className="case-hero__visual entrance entrance--delayed">
            <div className="case-phone">
              <div className="case-phone__speaker" aria-hidden="true" />
              <div className="case-phone__screen">
                <Image
                  className="case-phone__capture"
                  src="/images/songspot/stats.svg"
                  alt="Écran d’accueil Songspot avec statistiques et modes solo et 1v1"
                  width={963}
                  height={2084}
                  sizes="(max-width: 740px) 74vw, 390px"
                  unoptimized
                  priority
                />
              </div>
            </div>
          </div>

          <dl className="case-facts">
            <div>
              <dt>Audience</dt>
              <dd>30 000+ inscrits</dd>
            </div>
            <div>
              <dt>Plateformes</dt>
              <dd>iOS, Android et Web</dd>
            </div>
            <div>
              <dt>Application</dt>
              <dd>Flutter</dd>
            </div>
            <div>
              <dt>Backend</dt>
              <dd>Django</dd>
            </div>
            <div>
              <dt>Publication</dt>
              <dd>Publié en mars 2026</dd>
            </div>
          </dl>
        </section>

        <section className="case-section shell" aria-labelledby="features-title">
          <div className="case-section__heading">
            <p className="eyebrow eyebrow--purple">Fonctionnalités</p>
            <h2 id="features-title">Des parties variées, seul ou face à un autre joueur.</h2>
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
            <h2 id="role-title">De l’idée à la publication.</h2>
            <p>
              J’ai conçu et développé Songspot de bout en bout : expérience
              utilisateur, application Flutter, backend Django, publication sur
              les stores, version web et évolution du produit après son
              lancement.
            </p>
          </div>
          <div className="result-block">
            <p className="eyebrow eyebrow--purple">Résultat</p>
            <strong>30 000+</strong>
            <p className="result-block__label">inscrits · début septembre 2026</p>
            <strong>≈ 3 000</strong>
            <p className="result-block__label">utilisateurs actifs par jour</p>
            <p className="result-block__note">
              Environ 3 000 utilisateurs actifs par jour observés sur les quatre
              premiers jours de mesure, début septembre 2026.
            </p>
          </div>
        </section>

        <section className="technical-section shell" aria-labelledby="technical-title">
          <p className="eyebrow eyebrow--purple">Défi technique</p>
          <h2 id="technical-title">Le 1v1 en temps réel.</h2>
          <p>
            Le mode duel repose sur des échanges en WebSocket entre l’application
            Flutter et le backend Django, avec Django Channels et Redis pour
            gérer la communication en temps réel entre les joueurs.
          </p>
        </section>

        <section className="technical-section shell" aria-labelledby="architecture-title">
          <p className="eyebrow eyebrow--purple">Architecture</p>
          <h2 id="architecture-title">Une application multiplateforme, un backend commun.</h2>
          <p>
            Flutter permet de proposer le jeu sur iOS, Android et le web.
            L’application communique avec une API Django REST Framework,
            adossée à PostgreSQL en production.
          </p>
          <p>
            Celery et Redis prennent en charge les tâches en arrière-plan.
            Le catalogue musical et les extraits audio s’appuient sur Deezer.
          </p>
        </section>

        <section className="gallery-section" aria-labelledby="gallery-title">
          <div className="gallery-section__heading shell">
            <p className="eyebrow eyebrow--purple">Dans le produit</p>
            <h2 id="gallery-title">Choisir, écouter, défier, progresser.</h2>
            <p>
              Les écrans clés d’une expérience conçue pour relancer une partie en
              quelques secondes.
            </p>
          </div>
          <ProjectGallery images={songspot.images} />
        </section>

        <section className="case-cta" aria-labelledby="case-cta-title">
          <div className="shell case-cta__inner">
            <p className="eyebrow eyebrow--purple">Essayer Songspot</p>
            <h2 id="case-cta-title">Prêt à tester votre culture musicale&nbsp;?</h2>
            <div className="case-actions case-actions--centered">
              <a
                className="button button--purple"
                href={songspot.links.appStore}
                target="_blank"
                rel="noreferrer"
              >
                Voir sur l’App Store ↗
              </a>
              <a
                className="button button--purple-outline"
                href={songspot.links.playStore}
                target="_blank"
                rel="noreferrer"
              >
                Voir sur Google Play ↗
              </a>
              <a
                className="text-link case-actions__website"
                href={songspot.links.website}
                target="_blank"
                rel="noreferrer"
              >
                Découvrir Songspot ↗
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
