import "./globals.css";
import ClientLayout from "@/client-layout";
import TopBar from "@/components/TopBar/TopBar";

export const metadata = {
  title: "Sharma Real Estates | Premium Properties in Hisar",
  description: "Your trusted partner for residential, commercial, land, and rental properties in Hisar, Haryana. We don't just build properties — we build assets.",
  keywords: "real estate, properties, Hisar, Haryana, residential, commercial, land, rental, investment, Sharma Real Estates",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          <TopBar />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
