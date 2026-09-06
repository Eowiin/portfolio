import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <p>© {new Date().getFullYear()} Ethan Saux</p>
        <Link href="#top">Retour en haut ↑</Link>
      </div>
    </footer>
  );
}
