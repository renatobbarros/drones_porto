import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const title = "Filmagem com Drone em Porto de Galinhas | Drone Porto PE";
const description =
  "Filmagem e fotos aéreas com drone em Porto de Galinhas e Ipojuca para pousadas, imóveis e eventos. Vídeo 4K, fotos 48MP e Reels verticais. Orçamento pelo WhatsApp.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  keywords: [
    "filmagem com drone Porto de Galinhas",
    "drone Ipojuca",
    "vídeo aéreo pousada",
    "fotos aéreas imóveis",
    "drone casamento praia",
    "Muro Alto",
    "Maracaípe",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Drone Porto PE",
    title,
    description:
      "Vídeo aéreo que vende: pousadas, imóveis e eventos em Porto de Galinhas, Muro Alto, Maracaípe e Ipojuca.",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#F3ECDF",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
