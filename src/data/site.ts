export type ContactLink = {
  label: "Email" | "LinkedIn" | "GitHub";
  href: string | null;
};

export const siteConfig = {
  name: "Ethan Saux",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title: "Ethan Saux — Développeur full-stack freelance",
  description:
    "Ethan Saux, développeur full-stack freelance. Applications mobiles et web, en distanciel de préférence ou en présentiel à Paris et ses alentours.",
  contactLinks: [
    { label: "Email", href: "mailto:contact@ethansaux.fr" },
    { label: "LinkedIn", href: null },
    { label: "GitHub", href: null },
  ] satisfies ContactLink[],
};
