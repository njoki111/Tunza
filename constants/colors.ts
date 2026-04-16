export const colors = {
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  success: {
    light: '#86efac',
    DEFAULT: '#22c55e',
    dark: '#15803d',
  },
  warning: {
    light: '#fde047',
    DEFAULT: '#eab308',
    dark: '#a16207',
  },
  error: {
    light: '#fca5a5',
    DEFAULT: '#ef4444',
    dark: '#b91c1c',
  },
  white: '#ffffff',
  black: '#000000',
} as const;

export const theme = {
  light: {
    background: colors.white,
    surface: colors.secondary[50],
    surfaceElevated: colors.white,
    text: colors.secondary[900],
    textSecondary: colors.secondary[600],
    textMuted: colors.secondary[400],
    border: colors.secondary[200],
    primary: colors.primary[600],
    primaryLight: colors.primary[100],
    primaryDark: colors.primary[800],
    tabIconDefault: colors.secondary[400],
    tabIconSelected: colors.primary[600],
  },
} as const;

export default theme;
