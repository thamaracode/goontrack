import { ThemeKey } from '../types/tracker';

export interface ThemeDefinition {
  id: ThemeKey;
  name: string;
  subtitle: string;
  emoji: string;
  unlockLevel: number;
  colors: {
    bg: string;
    surface: string;
    surfaceLight: string;
    surfaceBorder: string;
    accentPrimary: string;
    accentSecondary: string;
    accentHighlight: string;
  };
}

export const THEMES: Record<ThemeKey, ThemeDefinition> = {
  purple: {
    id: 'purple',
    name: 'Purple Night',
    subtitle: 'Classic Arcade Default',
    emoji: '🟣',
    unlockLevel: 1,
    colors: {
      bg: '#100B1F',
      surface: '#1A1230',
      surfaceLight: '#261B45',
      surfaceBorder: '#37265F',
      accentPrimary: '#8B5CF6',
      accentSecondary: '#F472B6',
      accentHighlight: '#FACC15',
    },
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber City',
    subtitle: 'Electric Neon & Matrix',
    emoji: '⚡',
    unlockLevel: 2,
    colors: {
      bg: '#060B17',
      surface: '#0D1629',
      surfaceLight: '#16223D',
      surfaceBorder: '#1E3258',
      accentPrimary: '#00F0FF',
      accentSecondary: '#B026FF',
      accentHighlight: '#00FF88',
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    subtitle: 'Warm Twilight Horizon',
    emoji: '🌅',
    unlockLevel: 3,
    colors: {
      bg: '#1B0D19',
      surface: '#281324',
      surfaceLight: '#381B33',
      surfaceBorder: '#52274A',
      accentPrimary: '#FF5A78',
      accentSecondary: '#FFA630',
      accentHighlight: '#FF3377',
    },
  },
  acid: {
    id: 'acid',
    name: 'Acid Lime',
    subtitle: 'High Energy Radioactive',
    emoji: '🧪',
    unlockLevel: 4,
    colors: {
      bg: '#09140B',
      surface: '#122415',
      surfaceLight: '#1A331F',
      surfaceBorder: '#274A2E',
      accentPrimary: '#22C55E',
      accentSecondary: '#CCFF00',
      accentHighlight: '#06B6D4',
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Deep Ocean',
    subtitle: 'Abyssal Bioluminescence',
    emoji: '🌊',
    unlockLevel: 5,
    colors: {
      bg: '#091624',
      surface: '#112338',
      surfaceLight: '#1B324D',
      surfaceBorder: '#29476B',
      accentPrimary: '#38BDF8',
      accentSecondary: '#6366F1',
      accentHighlight: '#2DD4BF',
    },
  },
  candy: {
    id: 'candy',
    name: 'Neon Candy',
    subtitle: 'Sweet Pop Explosion',
    emoji: '🍬',
    unlockLevel: 6,
    colors: {
      bg: '#1A0A18',
      surface: '#280E25',
      surfaceLight: '#3B1437',
      surfaceBorder: '#541C4E',
      accentPrimary: '#F43F5E',
      accentSecondary: '#D946EF',
      accentHighlight: '#FBBF24',
    },
  },
  mono: {
    id: 'mono',
    name: 'Stealth Mono',
    subtitle: 'Brutalist Matte Carbon',
    emoji: '🕶️',
    unlockLevel: 7,
    colors: {
      bg: '#0F0F12',
      surface: '#1A1A20',
      surfaceLight: '#26262E',
      surfaceBorder: '#383845',
      accentPrimary: '#E2E8F0',
      accentSecondary: '#94A3B8',
      accentHighlight: '#F8FAFC',
    },
  },
  arcade: {
    id: 'arcade',
    name: 'Retro 80s',
    subtitle: 'Synthwave Dreamscape',
    emoji: '🕹️',
    unlockLevel: 8,
    colors: {
      bg: '#140924',
      surface: '#200E38',
      surfaceLight: '#2E1452',
      surfaceBorder: '#451D7A',
      accentPrimary: '#FF007F',
      accentSecondary: '#00F0FF',
      accentHighlight: '#FACC15',
    },
  },
};

export function applyThemeVariables(themeKey: ThemeKey): void {
  if (typeof window === 'undefined') return;
  const theme = THEMES[themeKey] || THEMES.purple;
  const root = document.documentElement;

  root.style.setProperty('--bg-color', theme.colors.bg);
  root.style.setProperty('--surface-color', theme.colors.surface);
  root.style.setProperty('--surface-light', theme.colors.surfaceLight);
  root.style.setProperty('--surface-border', theme.colors.surfaceBorder);
  root.style.setProperty('--accent-primary', theme.colors.accentPrimary);
  root.style.setProperty('--accent-secondary', theme.colors.accentSecondary);
  root.style.setProperty('--accent-highlight', theme.colors.accentHighlight);
}
