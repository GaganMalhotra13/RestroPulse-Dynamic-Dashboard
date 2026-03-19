// Color Design Tokens - Modern SaaS Theme (Slate, Indigo, Teal)
export const tokensDark = {
  grey: {
    0: "#ffffff",
    10: "#f8fafc", 
    50: "#f1f5f9", 
    100: "#e2e8f0",
    200: "#cbd5e1",
    300: "#94a3b8",
    400: "#64748b",
    500: "#475569", // True mid-grey
    600: "#334155",
    700: "#1e293b",
    800: "#0f172a", // Perfect for Card Backgrounds (Alt)
    900: "#020617", // Perfect for Main Background (Default)
    1000: "#000000",
  },
  primary: {
    // Deep Indigo (Professional, Trustworthy, Vibrant)
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1", // Main Brand Color
    600: "#4f46e5", // Hover State
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
  },
  secondary: {
    // Vibrant Teal (For accents, charts, success metrics)
    50: "#f0fdfa",
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf", // Bright accent for Dark Mode
    500: "#14b8a6", // Main accent for Light Mode
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
  },
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
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // 🌙 PALETTE VALUES FOR DARK MODE
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[500],
              light: tokensDark.primary[400],
              dark: tokensDark.primary[600],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[400], // Brighter teal for dark mode
              light: tokensDark.secondary[300],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[400],
            },
            background: {
              default: tokensDark.grey[900], // 🚨 FIXED: Now it's deep slate, not purple!
              alt: tokensDark.grey[800],     // 🚨 FIXED: Cards will have a nice distinct slate tone
            },
          }
        : {
            // ☀️ PALETTE VALUES FOR LIGHT MODE
            primary: {
              ...tokensLight.primary,
              main: tokensDark.primary[600], // Deep Indigo for contrast in light mode
              light: tokensDark.primary[500],
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[600], // Deeper teal for readability
              light: tokensDark.secondary[500],
            },
            neutral: {
              ...tokensLight.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[10],  // 🚨 FIXED: Very light grey background
              alt: tokensDark.grey[0],       // 🚨 FIXED: Pure white cards
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
        fontWeight: 700, // Added font weights for better hierarchy
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
        fontWeight: 600,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
        fontWeight: 600,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
        fontWeight: 600,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
        fontWeight: 500,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
        fontWeight: 500,
      },
    },
  };
};