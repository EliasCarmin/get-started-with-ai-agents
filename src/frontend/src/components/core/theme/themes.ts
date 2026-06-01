import {
  BrandVariants,
  createDarkTheme,
  createLightTheme,
  Theme,
} from "@fluentui/react-components";

// Define our premium Peru sunset & gold brand colors for Ingram Tours
const brandColors: BrandVariants = {
  10: "#0D0A05",
  20: "#2B1E0C",
  30: "#442F13",
  40: "#5A3E19", // Fixed key '45' to '40'
  50: "#6F4F21",
  60: "#866028",
  70: "#9E7230",
  80: "#B8863A", // Premium Gold / Sun God Yellow
  90: "#CD9845",
  100: "#DBA550",
  110: "#E6B360",
  120: "#F0C173",
  130: "#F9CF89",
  140: "#FDDEA2",
  150: "#FEEDC0",
  160: "#FFFCDD",
};

export const lightTheme: Theme = {
  ...createLightTheme(brandColors),
};

export const darkTheme: Theme = {
  ...createDarkTheme(brandColors),
  colorBrandForeground1: brandColors[110],
  colorBrandForeground2: brandColors[120],
  colorBrandForegroundLink: brandColors[140],
};

