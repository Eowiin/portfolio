import Link from "next/link";

const navigation = [
  { label: "Projets", href: "/#projets" },
  { label: "À propos", href: "/#a-propos" },
  { label: "Contact", href: "/#contact" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link className="wordmark" href="/" aria-label="Ethan Saux — Accueil">
          Ethan Saux
        </Link>
        <nav aria-label="Navigation principale">
          <ul className="site-nav">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
