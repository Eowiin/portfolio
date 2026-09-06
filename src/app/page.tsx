import Link from "next/link";
import { PhoneComposition } from "@/components/phone-composition";
import { ProjectCard } from "@/components/project-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";

export default function Home() {
  const visibleContactLinks = siteConfig.contactLinks.filter(
    (link) => link.href !== null,
  );

  return (
    <div id="top" className="home-page">
      <SiteHeader />
      <main id="contenu">
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero__copy entrance">
            <p className="eyebrow">Conception · Développement · Publication</p>
            <h1 id="hero-title">Je transforme des idées en produits numériques.</h1>
            <p className="hero__description">
              De la conception à la mise en ligne, je crée des applications
              pensées pour être réellement utilisées.
            </p>
            <p className="hero__availability">
              Développeur full-stack freelance · Distanciel privilégié · Paris et alentours
            </p>
            <Link className="button button--outline" href="#projets">
              Voir les projets
            </Link>
          </div>
          <div className="entrance entrance--delayed">
            <PhoneComposition />
          </div>
        </section>

        <section className="projects-section shell" id="projets" aria-labelledby="projects-title">
          <div className="section-heading">
            <p className="eyebrow">Projet sélectionné</p>
            <h2 id="projects-title">Un produit lancé, utilisé et amélioré.</h2>
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <ProjectCard project={project} key={project.slug} />
            ))}
          </div>
        </section>

        <section className="about-section shell" id="a-propos" aria-labelledby="about-title">
          <div>
            <p className="eyebrow">À propos</p>
            <h2 id="about-title">Du besoin concret au produit final.</h2>
          </div>
          <div className="about-section__copy">
            <p>
              Je suis Ethan Saux, développeur full-stack freelance. J’ai terminé
              mes études à Epitech. J’aime partir d’un besoin concret, construire une première
              version, la publier puis l’améliorer grâce aux retours de ses
              utilisateurs.
            </p>
            <p>
              Mon parcours m’a amené à travailler sur des applications mobiles,
              des backends et des produits utilisés en conditions réelles. Je
              porte une attention particulière à la simplicité, à l’expérience
              utilisateur et à la fiabilité du produit final.
            </p>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-section__light" aria-hidden="true" />
          <div className="shell contact-section__inner">
            <p className="eyebrow">Contact</p>
            <h2 id="contact-title">Un projet à développer ensemble&nbsp;?</h2>
            <p>
              Je recherche des missions freelance, de préférence en distanciel.
              Je peux également intervenir en présentiel à Paris et ses alentours.
            </p>
            {visibleContactLinks.length > 0 && (
              <ul className="contact-links">
                {visibleContactLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href ?? undefined}
                      target={link.label === "Email" ? undefined : "_blank"}
                      rel={link.label === "Email" ? undefined : "noreferrer"}
                    >
                      {link.label === "Email" ? link.href?.replace("mailto:", "") : link.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
