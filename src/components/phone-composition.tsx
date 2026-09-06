import Image, { type StaticImageData } from "next/image";
import playlistsCapture from "@/assets/songspot/playlists.webp";
import statsCapture from "@/assets/songspot/stats.webp";

type PhoneProps = {
  src: StaticImageData;
  alt: string;
  className: string;
};

function Phone({ src, alt, className }: PhoneProps) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone__speaker" aria-hidden="true" />
      <div className="phone__screen">
        <Image
          className="phone__capture"
          src={src}
          alt={alt}
          preload
          placeholder="blur"
          // Already compressed at source: avoid image processing on the first request.
          unoptimized
        />
      </div>
    </div>
  );
}

export function PhoneComposition() {
  return (
    <div
      className="phone-composition"
      aria-label="Aperçu de l’application Songspot"
    >
      <div className="phone-composition__glow" aria-hidden="true" />
      <Phone
        className="phone--back"
        src={playlistsCapture}
        alt="Songspot, sélection d’une playlist musicale"
      />
      <Phone
        className="phone--front"
        src={statsCapture}
        alt="Songspot, écran d’accueil avec le suivi de progression"
      />
    </div>
  );
}
