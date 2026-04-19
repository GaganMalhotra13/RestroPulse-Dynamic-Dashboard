// Color Design Tokens - Koki Inspired (Raspberry, Charcoal, Slate)
export const tokensDark = {
  grey: {
    0: "#ffffff",
    10: "#f8fafc",
    50: "#f1f5f9",
    100: "#e2e8f0",
    200: "#cbd5e1",
    300: "#94a3b8",
    400: "#64748b", // 👈 Dashboard ab ise padh payega
    500: "#475569",
    600: "#334155",
    700: "#1e293b",
    800: "#0f172a", // Card Background
    900: "#020617", // Main Background
    1000: "#000000",
  },
  primary: {
    // Raspberry Pink (Koki Vibe)
    100: "#fce7f3",
    200: "#fbcfe8",
    300: "#f9a8d4",
    400: "#f472b6",
    500: "#D13B62", // Main Koki Pink
    600: "#db2777",
    700: "#be185d",
    800: "#9d174d",
    900: "#831843",
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
              main: "#D13B62", // Accent Pink
            },
            neutral: {
              ...t.grey,
              main: t.grey[500],
            },
            background: {
              default: t.grey[900],
              alt: t.grey[800],
            },
          }
        : {
            // Light Mode (Exact Koki Look)
            primary: {
              ...t.primary,
              main: "#D13B62", 
            },
            secondary: {
              main: "#2D3748", // Charcoal
            },
            neutral: {
              ...t.grey,
              main: t.grey[500],
            },
            background: {
              default: "#F7F8FC", 
              alt: "#FFFFFF", 
            },
            text: {
              primary: "#2D3748",
              secondary: "#718096",
            },
          }),
    },
    typography: {
      fontFamily: ["'Poppins'", "sans-serif"].join(","),
      h1: { fontWeight: 800, fontSize: "2.5rem" },
      h2: { fontWeight: 700, fontSize: "2rem" },
      h3: { fontWeight: 700, fontSize: "1.5rem" },
      h4: { fontWeight: 600, fontSize: "1.2rem" },
      h5: { fontWeight: 600, fontSize: "1rem" },
      h6: { fontWeight: 400, fontSize: "0.8rem" },
    },
    shape: {
      borderRadius: 16,
    },
  };
};