import Image from "next/image";
import type { CSSProperties } from "react";
import type { ProjectImage } from "@/data/projects";

// Each sequence must be wider than the widest screen, or the loop shows a gap.
const MIN_ITEMS_PER_SEQUENCE = 10;
const SECONDS_PER_ITEM = 65 / 6;

export function ProjectGallery({
  projectName,
  images,
}: {
  projectName: string;
  images: ProjectImage[];
}) {
  const rounds = Math.ceil(MIN_ITEMS_PER_SEQUENCE / images.length);
  const items = Array.from({ length: rounds }, (_, round) =>
    images.map((image, index) => ({ image, index, round })),
  ).flat();
  const style = {
    "--gallery-duration": `${Math.round(items.length * SECONDS_PER_ITEM)}s`,
  } as CSSProperties;

  return (
    <div
      className="gallery-viewport"
      id="galerie"
      role="region"
      aria-label={`Captures ${projectName} en défilement continu`}
    >
      <div className="gallery-grid" style={style}>
        {[0, 1].map((sequenceIndex) => (
          <div
            className="gallery-sequence"
            key={sequenceIndex}
            aria-hidden={sequenceIndex === 0 ? undefined : true}
          >
            {items.map(({ image, index, round }) => (
              <figure
                className="gallery-item"
                key={`${round}-${image.src}`}
                aria-hidden={round === 0 ? undefined : true}
              >
                <div className="gallery-item__capture">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 640px) 72vw, (max-width: 1100px) 34vw, 290px"
                    unoptimized
                  />
                </div>
                <figcaption>
                  <span>0{index + 1}</span>
                  <p>{image.label}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
