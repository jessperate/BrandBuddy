export interface ColorEntry {
  name: string;
  hex: string;
  variable?: string;
  usage?: string;
}

export interface SecondaryColor {
  hex: string;
  hue: string;
  tier: string;
}

export interface WritingRule {
  id: string;
  rule: string;
  appliesTo: string;
}

export interface TypeScaleRow {
  name: string;
  fontRole: 'serif' | 'sans' | 'mono';
  size: string;
  weight: number;
  tracking: string;
  lh: number;
  usage: string;
}

export interface LogoVariant {
  id: string;
  label: string;
  bg: string;
  logoFill: string;
  labelColor: string;
  border?: boolean;
  token?: string;
}

export interface LogoRule {
  id: string;
  type: 'do' | 'dont';
  rule: string;
}

export interface LogoSize {
  id: string;
  label: string;
  width: number;
  usage: string;
}

export interface RuleGroup {
  category: string;
  rules: string[];
}

export interface FontFallback {
  brand: string;
  role: string;
  fallback: string;
}

export interface BrandFonts {
  sans: { name: string; fallback: string };
  serif: { name: string; fallback: string };
  mono: { name: string; fallback: string };
}

export interface BrandData {
  name: string;
  url?: string;
  primaryColor: string;
  about: string[];
  voiceAndTone: string;
  authorPersona: string;
  writingRules: WritingRule[];
  colors: {
    brand: ColorEntry[];
    text: ColorEntry[];
    secondary: SecondaryColor[];
    secHues: string[];
    secTiers: string[];
  };
  fonts: BrandFonts;
  typeScale: TypeScaleRow[];
  logoVariants: LogoVariant[];
  logoRules: LogoRule[];
  logoSizes: LogoSize[];
  dataViz: {
    palette: Array<{ hex: string; label: string }>;
    typography: Array<{ role: string; spec: string }>;
  };
  slideDesign: {
    ruleGroups: RuleGroup[];
    fontFallbacks: FontFallback[];
  };
}
