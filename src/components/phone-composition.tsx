import Image from "next/image";

type PhoneProps = {
  src: string;
  alt: string;
  className: string;
  priority?: boolean;
};

function Phone({ src, alt, className, priority = false }: PhoneProps) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone__speaker" aria-hidden="true" />
      <div className="phone__screen">
        <Image
          className="phone__capture"
          src={src}
          alt={alt}
          width={963}
          height={2084}
          sizes="(max-width: 720px) 68vw, 310px"
          priority={priority}
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
        src="/images/songspot/playlists.svg"
        alt="Songspot, sélection d’une playlist musicale"
      />
      <Phone
        className="phone--front"
        src="/images/songspot/stats.svg"
        alt="Songspot, écran d’accueil avec le suivi de progression"
        priority
      />
    </div>
  );
}
