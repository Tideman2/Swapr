import { createTheme } from '@mui/material/styles';

const baseTypography = {
    fontFamily: `'Geist', 'Inter', 'Roboto', sans-serif`,

    h1: {
        fontSize: 'clamp(2.5rem, 6vw, 3.75rem)',
        fontWeight: 700,
        letterSpacing: '-0.02em',
    },
    h2: {
        fontSize: 'clamp(2.2rem, 5vw, 3rem)',
        fontWeight: 600,
    },
    h3: {
        fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
        fontWeight: 600,
    },
    h4: {
        fontSize: 'clamp(1.6rem, 3.2vw, 2rem)',
        fontWeight: 600,
    },
    h5: {
        fontSize: 'clamp(1.4rem, 2.5vw, 1.6rem)',
        fontWeight: 500,
    },
    h6: {
        fontSize: 'clamp(1.2rem, 2vw, 1.3rem)',
        fontWeight: 500,
    },

    subtitle1: {
        fontSize: 'clamp(1rem, 1.8vw, 1.1rem)',
        fontWeight: 500,
        color: '#9FB3C8',
    },
    subtitle2: {
        fontSize: 'clamp(0.9rem, 1.5vw, 0.95rem)',
        fontWeight: 500,
    },

    body1: {
        fontSize: 'clamp(0.95rem, 1.4vw, 1rem)',
        lineHeight: 1.7,
    },
    body2: {
        fontSize: 'clamp(0.85rem, 1.2vw, 0.9rem)',
        lineHeight: 1.6,
    },

    caption: {
        fontSize: 'clamp(0.7rem, 1vw, 0.75rem)',
        opacity: 0.7,
    },
    overline: {
        fontSize: 'clamp(0.65rem, 0.9vw, 0.7rem)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
    },
};

const baseComponents = {
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                textTransform: 'none',
                boxShadow: '0 0 12px rgba(0,229,255,0.3)',

                // default (md)
                fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
                padding: 'clamp(6px, 1vw, 10px) clamp(14px, 2vw, 18px)',
            },

            sizeSmall: {
                fontSize: 'clamp(0.75rem, 1vw, 0.85rem)',
                padding: 'clamp(4px, 0.8vw, 6px) clamp(10px, 1.5vw, 14px)',
            },

            sizeLarge: {
                fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                padding: 'clamp(8px, 1.2vw, 12px) clamp(18px, 2.5vw, 24px)',
            },

            contained: {
                color: 'inherit',
                '&:hover': {
                    filter: 'brightness(1.1)',
                },
            },
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 16,
                boxShadow: '0 0 20px rgba(124,77,255,0.15)',
            },
        },
    },
    MuiLink: {
        styleOverrides: {
            root: {
                '&.active': {},
                '&:hover': {},
            },
        },
    },
};

// ------------------- LIGHT THEME -------------------
export const lightTheme = createTheme({
    palette: {
        mode: 'light',

        // ---------------- Primary & CTA ----------------
        primary: {
            main: '#007BFF',        // CTA buttons, primary links (darker blue for contrast)
            contrastText: '#FFFFFF', // Text on primary buttons
        },
        secondary: {
            main: '#9C6BFF',        // Secondary buttons / highlights
            contrastText: '#FFFFFF',
        },

        // ---------------- Backgrounds ----------------
        background: {
            default: '#F4F7FA',     // Main page
            paper: '#FFFFFF',       // Cards, panels
        },

        // ---------------- Text ----------------
        text: {
            primary: '#0A0F1C',     // Main text on light background
            secondary: '#5C6B82',   // Subtext / labels
            disabled: '#9FB3C8',    // Disabled text
        },

        // ---------------- Feedback / Status ----------------
        success: { main: '#00C48C', contrastText: '#FFFFFF' },
        error: { main: '#FF4D6D', contrastText: '#FFFFFF' },
        warning: { main: '#FFC857', contrastText: '#0A0F1C' },
        info: { main: '#38BDF8', contrastText: '#FFFFFF' },

        // ---------------- Divider / Borders ----------------
        divider: '#D1D9E6',       // Lines / borders
    },

    typography: baseTypography,
    components: {
        ...baseComponents,
        MuiCard: {
            styleOverrides: {
                root: {
                    ...baseComponents.MuiCard.styleOverrides.root,
                    background: '#FFFFFF',
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#007BFF',            // Links
                    '&.active': { color: '#9C6BFF' },
                    '&:hover': { textShadow: '0 0 6px #007BFF' },
                },
            },
        },
    },
});