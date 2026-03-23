import type { BrandData } from '../types';

export const AIROPS_BRAND: BrandData = {
  name: 'AirOps',
  url: 'airops.com',
  primaryColor: '#008c44',

  about: [
    'At AirOps, we help brands craft content that wins search. We power content strategy, creation, and performance so your brand gets seen, cited, and celebrated as search changes across Google and AI experiences.',
    'Search isn\'t clicking like it used to. AI is reshaping how people discover and connect with brands, and content quality, craft, and genuine information now play a bigger role in staying visible. We believe this is the moment for marketers to pair creativity and taste with systems design to increase impact.',
    'AirOps is where big ideas become real results, and where marketers become leaders in the new era of Content Engineering. We give you the data, tools, playbooks, and precision needed to engineer human-in-the-loop content that earns visibility and grows your audience.',
    'Our platform brings together two connected layers—Insights and Action—so teams can move from understanding what\'s working to producing content improvements without bouncing between tools.',
    'The Action layer turns opportunities into content that stands out. AirOps blends your brand knowledge, SEO signals, and AI insights with human input and agentic workflows so AI handles the heavy lift and humans focus on the parts that matter—resulting in content audiences trust and AI rewards.',
    'We also help teams operate with confidence through Brand Kits & Knowledge, where you can collect your tone, rules, references, and context in one home to keep content true to the brand every time.',
    'Beyond software, we invest in the next generation of operators through our Content Engineering Certification. We offer training designed to help marketers build systems, learn playbooks, and level up alongside other practitioners.',
  ],

  voiceAndTone: 'Voice stays constant; tone flexes by context. Our voice is expert, optimistic, and empowering. We write with authority from building first-of-their-kind products, but stay warm and human. We lead with clarity, empathy, and subtle wit. We use direct, instructional language that stays businesslike but readable, favoring second-person ("your brand," "you need") and short paragraphs. Structure is scannable: bolded TL;DR sections, H2/H3 headings framed as questions, step-by-step sequences. We back claims with concrete data, metrics, and named platforms. Tone flexes across five modes: (1) Functional + Data Driven for docs, release notes, research, UI copy, sales decks; (2) Empowering for product announcements, demos, customer stories, thought leadership, social; (3) Collaborative for support, onboarding, nurture sequences; (4) Aspirational for website copy, keynotes, investor decks, blog posts; (5) Witty + Clever for LinkedIn, social, ad copy, event invites. We avoid heavy jargon, doomsday AI language, and corporate stiffness.',

  authorPersona: 'Think of AirOps as your easy-going, intelligent, and animated friend who shows up early with coffee, eager to explore the day\'s adventures. When you spend time with them, you feel comfortable and intrigued with what topic they\'ll bring next. They flow smoothly from deep, complicated subjects to lighthearted stories that leave you laughing. They\'re social, friendly, and don\'t believe in hoarding useful knowledge. They share what they know so everyone around them is more independent and capable. They live with a growth mindset, and that spirit is contagious. Your success is their success. If life and career is a game, they play it like professionals, not amateurs. We speak like experienced and friendly coaches—inclusive, welcoming, and respectful when talking tech. We treat every partner and project seriously, educating without patronizing or confusing. Using conversational voice and playful humor, we bring joy to their work, preferring the subtle over the noisy.',

  writingRules: [
    { id: '1',  rule: 'Open with a bolded "TL;DR" section that summarizes the piece in 4–6 bullet points.', appliesTo: 'Global' },
    { id: '2',  rule: 'Use a skimmable outline built from H2/H3 headings, including step-based sections ("Step 1," "Step 2," etc.) or numbered strategy lists for process content.', appliesTo: 'Global' },
    { id: '3',  rule: 'Address the reader directly with second-person language and keep paragraphs short (1–3 sentences), using bullet lists for examples, criteria, and definitions.', appliesTo: 'Global' },
    { id: '4',  rule: 'Never use em dashes as dramatic pauses. If a sentence needs one to hold together, rewrite it. Use a period instead.', appliesTo: 'Global' },
    { id: '5',  rule: 'Never start sentences with "In today\'s world," "In an era where," or similar scene-setting clichés. Get to the point directly.', appliesTo: 'Global' },
    { id: '6',  rule: 'Never use "delve into," "it\'s worth noting that," or "leveraging." Use specific verbs: explore, use, tap, apply, connect, build.', appliesTo: 'Global' },
    { id: '7',  rule: 'Avoid the "If X, then Y" construction. Replace with plain, direct language. Not "If you want to grow visibility, then you need great content." Say "Great content is how you grow visibility."', appliesTo: 'Global' },
    { id: '8',  rule: 'Never use hollow affirmations like "Great question!" or "Absolutely!" or "Certainly!" at the start of responses. They\'re filler and an AI tell.', appliesTo: 'Global' },
    { id: '9',  rule: 'Avoid overly formal transitions like "Furthermore," "Moreover," and "Additionally." Use connective tissue or just start a new sentence.', appliesTo: 'Global' },
    { id: '10', rule: 'Don\'t end lists with "and beyond!" (e.g. "content, SEO, and beyond!"). It\'s vague. Name the actual thing or cut the list.', appliesTo: 'Global' },
  ],

  colors: {
    brand: [
      { name: 'Near Black',   hex: '#000d05', variable: '--color-near-black',   usage: 'Primary text, key UI' },
      { name: 'Green 500',    hex: '#008c44', variable: '--color-green-500',    usage: 'Primary CTAs, brand' },
      { name: 'Green 600',    hex: '#002910', variable: '--color-green-600',    usage: 'Hero backgrounds' },
      { name: 'Interaction',  hex: '#00ff64', variable: '--color-interaction',  usage: 'Hover, active states' },
      { name: 'Green 200',    hex: '#CCFFE0', variable: '--color-green-200',    usage: 'Highlight tints' },
      { name: 'Stroke Green', hex: '#d4e8da', variable: '--color-stroke-green', usage: 'Borders, dividers' },
      { name: 'Accent Label', hex: '#EEFF8C', variable: '--color-accent-label', usage: 'Pill / tag fills' },
      { name: 'White',        hex: '#ffffff', variable: '--background',         usage: 'Page backgrounds' },
    ],
    text: [
      { name: 'Text Primary',   hex: '#000d05', variable: '--color-text-primary',   usage: 'Body copy' },
      { name: 'Text Secondary', hex: '#676c79', variable: '--color-text-secondary', usage: 'Captions, meta' },
      { name: 'Text Tertiary',  hex: '#a5aab6', variable: '--color-text-tertiary',  usage: 'Disabled, placeholder' },
    ],
    secondary: [
      { hex: '#EEF5F1', hue: 'Green',   tier: '50' },
      { hex: '#F5F5E8', hue: 'Olive',   tier: '50' },
      { hex: '#E8EEF5', hue: 'Teal',    tier: '50' },
      { hex: '#E8E8F8', hue: 'Navy',    tier: '50' },
      { hex: '#EEE8F8', hue: 'Purple',  tier: '50' },
      { hex: '#F8E8F0', hue: 'Magenta', tier: '50' },
      { hex: '#F8EEE8', hue: 'Brown',   tier: '50' },
      { hex: '#D4E8DA', hue: 'Green',   tier: '100' },
      { hex: '#F4FFB8', hue: 'Olive',   tier: '100' },
      { hex: '#B8D8F0', hue: 'Teal',    tier: '100' },
      { hex: '#C8C8FF', hue: 'Navy',    tier: '100' },
      { hex: '#D8C8F0', hue: 'Purple',  tier: '100' },
      { hex: '#F0C8D8', hue: 'Magenta', tier: '100' },
      { hex: '#F0D0C8', hue: 'Brown',   tier: '100' },
      { hex: '#2D8859', hue: 'Green',   tier: '500' },
      { hex: '#88882D', hue: 'Olive',   tier: '500' },
      { hex: '#2D6B7A', hue: 'Teal',    tier: '500' },
      { hex: '#0000CC', hue: 'Navy',    tier: '500' },
      { hex: '#6B3D8B', hue: 'Purple',  tier: '500' },
      { hex: '#83428B', hue: 'Magenta', tier: '500' },
      { hex: '#8B4D42', hue: 'Brown',   tier: '500' },
      { hex: '#003D26', hue: 'Green',   tier: '900' },
      { hex: '#3D3D0D', hue: 'Olive',   tier: '900' },
      { hex: '#0D2D3D', hue: 'Teal',    tier: '900' },
      { hex: '#00004D', hue: 'Navy',    tier: '900' },
      { hex: '#2D1A3D', hue: 'Purple',  tier: '900' },
      { hex: '#4D1A3D', hue: 'Magenta', tier: '900' },
      { hex: '#3D1D1A', hue: 'Brown',   tier: '900' },
    ],
    secHues: ['Green', 'Olive', 'Teal', 'Navy', 'Purple', 'Magenta', 'Brown'],
    secTiers: ['50', '100', '500', '900'],
  },

  fonts: {
    sans:  { name: 'Saans',      fallback: "'DM Sans', 'Helvetica Neue', sans-serif" },
    serif: { name: 'Serrif VF',  fallback: 'Georgia, serif' },
    mono:  { name: 'Saans Mono', fallback: "'DM Mono', monospace" },
  },

  typeScale: [
    { name: 'Display',       fontRole: 'serif', size: '56px', weight: 400, tracking: '-0.02em', lh: 1.1, usage: 'Hero headlines' },
    { name: 'H3',            fontRole: 'serif', size: '32px', weight: 400, tracking: '-0.02em', lh: 1.2, usage: 'Section headings' },
    { name: 'H4 / UI Title', fontRole: 'sans',  size: '20px', weight: 600, tracking: '-0.01em', lh: 1.3, usage: 'UI titles, labels' },
    { name: 'Body',          fontRole: 'sans',  size: '16px', weight: 400, tracking: '0',       lh: 1.6, usage: 'Running text' },
    { name: 'Caption',       fontRole: 'sans',  size: '14px', weight: 400, tracking: '0',       lh: 1.5, usage: 'Metadata, captions' },
    { name: 'Label / Pill',  fontRole: 'mono',  size: '11px', weight: 500, tracking: '0.08em',  lh: 1,   usage: 'Tags, axis values' },
  ],

  logoVariants: [
    { id: 'on-white',       label: 'On White',             bg: '#ffffff', logoFill: '#0B0E16', labelColor: '#a5aab6',               border: true,  token: '--background'        },
    { id: 'on-forest',      label: 'On Forest Dark',       bg: '#002910', logoFill: '#ffffff', labelColor: 'rgba(255,255,255,0.38)', border: false, token: '--color-green-600'  },
    { id: 'on-near-black',  label: 'On Near Black',        bg: '#000d05', logoFill: '#ffffff', labelColor: 'rgba(255,255,255,0.38)', border: false, token: '--color-near-black' },
    { id: 'on-interaction', label: 'On Interaction Green', bg: '#00ff64', logoFill: '#0B0E16', labelColor: 'rgba(0,13,5,0.45)',      border: false, token: '--color-interaction'},
  ],

  logoSizes: [
    { id: 's1', label: 'Large',   width: 140, usage: 'Hero, OG images, keynote slides' },
    { id: 's2', label: 'Medium',  width: 100, usage: 'Navigation, email headers, print' },
    { id: 's3', label: 'Small',   width: 72,  usage: 'App headers, favicons context, badges' },
    { id: 's4', label: 'Minimum', width: 56,  usage: 'Absolute minimum — do not use below this' },
  ],

  logoRules: [
    { id: 'd1', type: 'do',   rule: 'Use the dark logo (#0B0E16) on all white and light-tinted backgrounds.' },
    { id: 'd2', type: 'do',   rule: 'Use the white logo on Forest Dark, Near Black, and any other dark backgrounds.' },
    { id: 'd3', type: 'do',   rule: 'Use the dark logo on Interaction Green — it has sufficient contrast at this luminance.' },
    { id: 'd4', type: 'do',   rule: 'Maintain the minimum clear space of 1× the cap-height of the "a" letterform on all sides.' },
    { id: 'x1', type: 'dont', rule: 'Never recolour the logo in any colour other than #0B0E16 (dark) or #ffffff (white).' },
    { id: 'x2', type: 'dont', rule: 'Never place the logo on low-contrast mid-tone backgrounds like Green 200 or tertiary surfaces.' },
    { id: 'x3', type: 'dont', rule: 'Never stretch, rotate, or alter the proportions of the wordmark.' },
    { id: 'x4', type: 'dont', rule: 'Never add drop shadows, outlines, or effects to the logo SVG.' },
  ],

  dataViz: {
    palette: [
      { hex: '#ccffe0', label: 'primary bar / fill (light)' },
      { hex: '#009b32', label: 'primary green / line' },
      { hex: '#eeff8c', label: 'highlight / accent bar' },
      { hex: '#001408', label: 'near black / text' },
      { hex: '#f8fffb', label: 'background (light)' },
      { hex: '#00250e', label: 'background (dark)' },
      { hex: '#a9a9a9', label: 'axes / grid lines' },
    ],
    typography: [
      { role: 'Headline',           spec: 'Serrif VF / Georgia · 40–56px · tracking −0.02em' },
      { role: 'Subhead / subtitle', spec: 'Saans Mono / DM Mono · 18–24px · tracking −0.02em' },
      { role: 'Axis labels',        spec: 'Saans Mono / DM Mono Regular · 14–18px · #a9a9a9' },
      { role: 'Value callouts',     spec: 'Saans / DM Mono Medium · 16–20px · #002910' },
      { role: 'Legend',             spec: 'Saans / DM Sans Medium · 14px' },
      { role: 'Footnote',           spec: 'Saans Mono / DM Mono Medium · 14–18px · 80% opacity' },
    ],
  },

  slideDesign: {
    fontFallbacks: [
      { brand: 'Serrif VF',  role: 'Headlines / Display',    fallback: "Georgia, 'Times New Roman', serif" },
      { brand: 'Saans',      role: 'Body / Labels / UI',     fallback: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" },
      { brand: 'Saans Mono', role: 'Categories / Code / Tags', fallback: "'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace" },
    ],
    ruleGroups: [
      {
        category: 'Typography',
        rules: [
          'Headlines always Serrif VF weight 400. Never bold on covers or section dividers.',
          'Body, labels, bullets always Saans. Saans Mono only for categories and code.',
          'Minimum body copy 13px at 16:9 widescreen. Never smaller — unreadable when projected.',
          'Italic sparingly: product name or key term emphasis only. Never decorative.',
        ],
      },
      {
        category: 'Colour',
        rules: [
          'Cover slides: Forest Dark (#002910) only. White logo and white type.',
          'Content slides: Green 50 (#EEF5F1) as field. Near Black type. Green accent strokes.',
          'Call-out boxes: secondary palette tints (Olive / Teal / Magenta 50–100). Never primary green.',
          'Max 3 secondary hues on any single slide.',
        ],
      },
      {
        category: 'Layout',
        rules: [
          'Slide margin: 48px all edges. No content bleeds except on full-bleed covers.',
          'Column layouts: max 4 columns. Always separated by stroke-green rules.',
          'Diagrams and arrows: #2D8859 · 1.5px · open line ends · no gradient fills.',
          'Logo always bottom-left at minimum 56px width on all content slides.',
        ],
      },
      {
        category: 'Content density',
        rules: [
          'One idea per slide. If a second idea is needed, make a second slide.',
          'Max 40 words of body copy. Stats slides: numbers only, no prose paragraphs.',
          'Persona photos (greyscale) anchor abstract system diagrams to real people.',
          'Customer logo bars: greyscale · single-row · bottom-anchored · never stacked.',
        ],
      },
    ],
  },
};
