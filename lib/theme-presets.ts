export type PaletteColors = {
  background: string;
  foreground: string;
  surface: string;
  border: string;
  muted: string;
  accent: string;
  accentForeground: string;
};

export type ColorPalette = {
  id: string;
  name: string;
  colors: PaletteColors;
};

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: "warm-neutral",
    name: "Warm Neutral",
    colors: {
      background: "#ffffff",
      foreground: "#292524",
      surface: "#f5f5f4",
      border: "#e7e5e4",
      muted: "#78716c",
      accent: "#1c1917",
      accentForeground: "#ffffff",
    },
  },
  {
    id: "cool-slate",
    name: "Cool Slate",
    colors: {
      background: "#ffffff",
      foreground: "#1e293b",
      surface: "#f1f5f9",
      border: "#e2e8f0",
      muted: "#64748b",
      accent: "#0f172a",
      accentForeground: "#ffffff",
    },
  },
  {
    id: "charcoal-cream",
    name: "Charcoal & Cream",
    colors: {
      background: "#faf7f2",
      foreground: "#262220",
      surface: "#f0ebe3",
      border: "#e0d8cc",
      muted: "#8a7f70",
      accent: "#262220",
      accentForeground: "#faf7f2",
    },
  },
  {
    id: "coastal-blue",
    name: "Coastal Blue",
    colors: {
      background: "#ffffff",
      foreground: "#1e3a5f",
      surface: "#eff6fb",
      border: "#d5e6f3",
      muted: "#5b7a99",
      accent: "#2c5f8a",
      accentForeground: "#ffffff",
    },
  },
  {
    id: "deep-forest",
    name: "Deep Forest",
    colors: {
      background: "#ffffff",
      foreground: "#1f2e22",
      surface: "#eef2ee",
      border: "#d7e0d8",
      muted: "#5f7263",
      accent: "#33513c",
      accentForeground: "#ffffff",
    },
  },
  {
    id: "terracotta",
    name: "Terracotta",
    colors: {
      background: "#fffaf6",
      foreground: "#3a2a20",
      surface: "#f7ece2",
      border: "#ecd9c8",
      muted: "#9c7b5f",
      accent: "#b0553a",
      accentForeground: "#ffffff",
    },
  },
  {
    id: "monochrome",
    name: "Monochrome",
    colors: {
      background: "#ffffff",
      foreground: "#000000",
      surface: "#f5f5f5",
      border: "#dddddd",
      muted: "#666666",
      accent: "#000000",
      accentForeground: "#ffffff",
    },
  },
];

export const PALETTE_IDS = COLOR_PALETTES.map((p) => p.id) as [string, ...string[]];

export function getPalette(id: string): ColorPalette {
  return COLOR_PALETTES.find((p) => p.id === id) ?? COLOR_PALETTES[0];
}

export type SiteTheme = {
  paletteId: string;
  fonts: {
    display: string;
    body: string;
  };
};

export const DEFAULT_THEME: SiteTheme = {
  paletteId: "warm-neutral",
  fonts: {
    display: "Playfair Display",
    body: "Inter",
  },
};

/**
 * A curated set of common Google Font family names, used to power a
 * <datalist> autocomplete on the font name inputs. The admin can still
 * type any Google Font name freely — this is just a helpful suggestion
 * list, not a restriction.
 */
export const GOOGLE_FONT_SUGGESTIONS: string[] = [
  // Serif / display
  "Playfair Display",
  "Cormorant",
  "Cormorant Garamond",
  "Libre Baskerville",
  "EB Garamond",
  "Merriweather",
  "Lora",
  "Crimson Text",
  "Crimson Pro",
  "Bitter",
  "Prata",
  "Marcellus",
  "Cardo",
  "Vollkorn",
  "Spectral",
  "PT Serif",
  "Old Standard TT",
  "Domine",
  "Frank Ruhl Libre",
  "Rozha One",
  "Fraunces",
  "Bodoni Moda",
  "DM Serif Display",
  "DM Serif Text",
  "Abril Fatface",
  "Alegreya",
  "Cinzel",
  "Josefin Slab",
  "Playfair Display SC",
  "Noto Serif",
  // Sans-serif / body
  "Inter",
  "Work Sans",
  "Lato",
  "Source Sans 3",
  "Nunito Sans",
  "Open Sans",
  "Roboto",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Karla",
  "Mulish",
  "Manrope",
  "DM Sans",
  "Rubik",
  "Jost",
  "Outfit",
  "Figtree",
  "Public Sans",
  "IBM Plex Sans",
  "Sora",
  "Urbanist",
  "Epilogue",
  "Plus Jakarta Sans",
  "Space Grotesk",
  "Archivo",
  "Barlow",
  "Assistant",
  "Hind",
  "Cabin",
  // Display / handwriting accents
  "Cormorant Infant",
  "Great Vibes",
  "Dancing Script",
  "Caveat",
  "Pacifico",
  "Sacramento",
  "Tangerine",
  "Amatic SC",
  "Comfortaa",
  "Quicksand",
];
