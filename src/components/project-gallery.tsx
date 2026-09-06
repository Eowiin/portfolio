import Image from "next/image";
import type { ProjectImage } from "@/data/projects";

export function ProjectGallery({ images }: { images: ProjectImage[] }) {
  return (
    <div
      className="gallery-viewport"
      id="galerie"
      role="region"
      aria-label="Captures Songspot en défilement continu"
    >
      <div className="gallery-grid">
        {[0, 1].map((sequenceIndex) => (
          <div
            className="gallery-sequence"
            key={sequenceIndex}
            aria-hidden={sequenceIndex === 0 ? undefined : true}
          >
            {images.map((image, index) => (
              <figure className="gallery-item" key={image.src}>
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
