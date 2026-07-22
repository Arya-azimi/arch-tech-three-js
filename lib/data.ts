/**
 * Mock content layer. In production this maps 1:1 to the Sanity/DatoCMS
 * schema (see `data_models_schema_for_cms`) fetched via GROQ. Kept local
 * here so the platform renders without a live CMS connection.
 */

export type ProjectCategory =
  | "Architecture"
  | "Interior"
  | "Commercial"
  | "Residential"
  | "Product";

export interface TechnicalDetail {
  attribute: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  client: string;
  location: string;
  completionYear: number;
  category: ProjectCategory;
  /** Gradient tuple used as a lightweight stand-in for cover imagery. */
  palette: [string, string];
  description: string;
  technicalDetails: TechnicalDetail[];
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: "01",
    title: "Monolith House",
    slug: "monolith-house",
    client: "Private Commission",
    location: "Engadin, CH",
    completionYear: 2024,
    category: "Residential",
    palette: ["#b8a886", "#1a1a1a"],
    description:
      "A concrete monolith carved into an alpine slope. Interior volumes follow the mountain light from dawn to dusk.",
    technicalDetails: [
      { attribute: "Square Footage", value: "620 m²" },
      { attribute: "Budget", value: "Confidential" },
      {
        attribute: "Key Materials",
        value: "Board-formed concrete, oak, brass",
      },
    ],
    featured: true,
  },
  {
    id: "02",
    title: "Atelier Verre",
    slug: "atelier-verre",
    client: "Maison Verre",
    location: "Paris, FR",
    completionYear: 2023,
    category: "Commercial",
    palette: ["#595959", "#f4f4f2"],
    description:
      "A glass flagship where product and architecture dissolve into one continuous reflective plane.",
    technicalDetails: [
      { attribute: "Square Footage", value: "310 m²" },
      { attribute: "Budget", value: "€2.4M" },
      {
        attribute: "Key Materials",
        value: "Low-iron glass, travertine, steel",
      },
    ],
    featured: true,
  },
  {
    id: "03",
    title: "Dune Pavilion",
    slug: "dune-pavilion",
    client: "Coastal Trust",
    location: "Comporta, PT",
    completionYear: 2024,
    category: "Architecture",
    palette: ["#d8cdb8", "#8a4b2b"],
    description:
      "An indoor–outdoor pavilion that surrenders its boundaries to the shifting dunes and Atlantic wind.",
    technicalDetails: [
      { attribute: "Square Footage", value: "450 m²" },
      { attribute: "Budget", value: "€1.8M" },
      {
        attribute: "Key Materials",
        value: "Lime plaster, cork, reclaimed pine",
      },
    ],
    featured: true,
  },
  {
    id: "04",
    title: "Penthouse 09",
    slug: "penthouse-09",
    client: "Plaza España Holdings",
    location: "Madrid, ES",
    completionYear: 2022,
    category: "Interior",
    palette: ["#042940", "#a6a6a6"],
    description:
      "A brutalist penthouse interior where oversized numerals and monolithic stone define a constrained palette.",
    technicalDetails: [
      { attribute: "Square Footage", value: "280 m²" },
      { attribute: "Budget", value: "€1.1M" },
      {
        attribute: "Key Materials",
        value: "Pietra serena, blackened steel, wool",
      },
    ],
    featured: true,
  },
  {
    id: "05",
    title: "Kettle Sofa System",
    slug: "kettle-sofa-system",
    client: "Arch Tech Editions",
    location: "Milan, IT",
    completionYear: 2025,
    category: "Product",
    palette: ["#a5715a", "#1c1c1c"],
    description:
      "A modular seating system engineered for infinite configuration — the subject of our live 3D configurator.",
    technicalDetails: [
      { attribute: "Modules", value: "12" },
      { attribute: "Budget", value: "From €6,900" },
      { attribute: "Key Materials", value: "Linen, oak, brushed steel" },
    ],
    featured: false,
  },
  {
    id: "06",
    title: "Quarry Gallery",
    slug: "quarry-gallery",
    client: "Fondazione Marmo",
    location: "Carrara, IT",
    completionYear: 2023,
    category: "Commercial",
    palette: ["#e5e5e5", "#333333"],
    description:
      "An exhibition space excavated from a working marble quarry, framing raw stone as permanent installation.",
    technicalDetails: [
      { attribute: "Square Footage", value: "900 m²" },
      { attribute: "Budget", value: "€3.6M" },
      { attribute: "Key Materials", value: "Carrara marble, glass, corten" },
    ],
    featured: false,
  },
];

export const getProject = (slug: string): Project | undefined =>
  PROJECTS.find((p) => p.slug === slug);

export const NAV_LINKS = [
  { label: "Projects", href: "/#projects" },
  { label: "Configurator", href: "/#configurator" },
  { label: "Studio", href: "/#studio" },
  { label: "Contact", href: "/#contact" },
];
