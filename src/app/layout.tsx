import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LumiNails Studio · Reservá tu turno de uñas en La Rioja",
  description:
    "Semipermanente, Kapping y Soft Gel. Elegí día y horario, pagá la seña de $2.000 y recibí tu confirmación al instante.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#E2A3B1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
