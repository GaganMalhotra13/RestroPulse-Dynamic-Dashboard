// Color Design Tokens - RestroPulse Original (Orange, Teal, Slate)
export const tokensDark = {
  grey: {
    0: "#ffffff",
    10: "#f8fafc",
    50: "#f1f5f9",
    100: "#e2e8f0",
    200: "#cbd5e1",
    300: "#94a3b8",
    400: "#64748b",
    500: "#475569",
    600: "#334155",
    700: "#1e293b",
    800: "#0f1117", // Deep Dark Background (from screenshots)
    900: "#090a0f",
    1000: "#000000",
  },
  primary: {
    // RestroPulse Vibrant Orange
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316", // Main Orange
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
  },
  secondary: {
    // RestroPulse Teal
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf",
    500: "#14b8a6", // Main Teal
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
  }
};

// Function that reverses the color palette for Light Mode
function reverseTokens(tokensDark) {
  const reversedTokens = {};
  Object.entries(tokensDark).forEach(([key, val]) => {
    const keys = Object.keys(val);
    const values = Object.values(val);
    const length = keys.length;
    const reversedObj = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}

export const tokensLight = reverseTokens(tokensDark);

// MUI Theme Settings
export const themeSettings = (mode) => {
  const t = mode === "dark" ? tokensDark : tokensLight;
  
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // Dark Mode
            primary: {
              ...t.primary,
              main: t.primary[500],
            },
            secondary: {
              ...t.secondary,
              main: t.secondary[500],
            },
            neutral: {
              ...t.grey,
              main: t.grey[500],
            },
            background: {
              default: t.grey[800], // #0f1117 (Sleek dark background)
              alt: t.grey[700],     // #1e293b (Card/Sidebar background)
            },
            // Added explicit status colors for your charts/KPIs
            success: { main: "#4ADE80" },
            warning: { main: "#FBBF24" },
            error: { main: "#F87171" },
          }
        : {
            // Light Mode (Exact match to the screenshots)
            primary: {
              ...t.primary,
              main: "#F97316", // Vibrant Orange
            },
            secondary: {
              ...t.secondary,
              main: "#14B8A6", // Teal
            },
            neutral: {
              ...t.grey,
              main: t.grey[500],
            },
            background: {
              default: "#FAFAFB", // Faint off-white so white cards pop
              alt: "#FFFFFF",     // Pure white for cards/sidebar
            },
            text: {
              primary: "#1E293B", // Dark slate text instead of harsh black
              secondary: "#64748B",
            },
            // Explicit status colors for light mode charts
            success: { main: "#4ADE80" },
            warning: { main: "#FBBF24" },
            error: { main: "#F87171" },
          }),
    },
    typography: {
      // Swapped to Inter for data/body, Poppins for headings (SaaS standard)
      fontFamily: ["'Inter'", "'Poppins'", "sans-serif"].join(","),
      h1: { fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "2.5rem" },
      h2: { fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "2rem" },
      h3: { fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "1.5rem" },
      h4: { fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "1.2rem" },
      h5: { fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "1rem" },
      h6: { fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: "0.8rem" },
    },
    shape: {
      borderRadius: 16, // Smoother, rounder edges like the screenshots
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            // Adds the soft floating shadow in light mode, removes it in dark mode
            boxShadow: mode === "light" ? "0px 4px 20px rgba(0, 0, 0, 0.04)" : "none",
            borderRadius: "16px",
            border: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none", // Fixes MUI's weird default dark-mode overlay
          }
        }
      }
    },
  };
};