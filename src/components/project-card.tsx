import Image from "next/image";
import Link from "next/link";
import { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      className="project-card"
      href={`/projects/${project.slug}`}
      aria-label={`Découvrir le projet ${project.name}`}
    >
      <div className="project-card__identity">
        <span className="songspot-mark" aria-hidden="true">
          <Image src="/images/songspot/logo.png" alt="" width={104} height={104} />
        </span>
        <h3>{project.name}</h3>
      </div>

      <div className="project-card__facts">
        <p className="project-card__category">{project.category}</p>
        <p className="project-card__metric">
          <span className="metric-dot" aria-hidden="true" />
          {project.registeredUsers}
        </p>
        {project.appStoreAchievement && (
          <p className="project-card__achievement">
            <strong>{project.appStoreAchievement.value}</strong>{" "}
            {project.appStoreAchievement.label}
          </p>
        )}
        <div className="project-card__meta">
          <span>{project.platforms.join(" · ")}</span>
          <span>{project.technologies.join(" · ")}</span>
        </div>
      </div>

      <span className="project-card__link">Découvrir le projet →</span>
    </Link>
  );
}
