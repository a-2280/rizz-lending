import localFont from "next/font/local";
import { Archivo } from "next/font/google";

export const clash = localFont({
  src: [
    { path: "./ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash",
  display: "swap",
});

export const gambetta = localFont({
  src: [
    { path: "./Gambetta-Italic.woff2", weight: "400", style: "italic" },
    { path: "./Gambetta-MediumItalic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-gambetta",
  display: "swap",
});

export const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});
