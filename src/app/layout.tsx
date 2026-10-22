import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Furrendly — Happy food for happy pets", template: "%s · Furrendly" },
  description:
    "Vet-approved dog, cat and small pet food delivered to your door. Subscribe & save 10%, free delivery over Rs 5,000.",
};

export const viewport: Viewport = { themeColor: "#12a27a" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col">
        <Header userName={user?.name ?? null} />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
