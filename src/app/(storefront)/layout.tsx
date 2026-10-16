import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MaintenanceBanner } from "@/components/layout/MaintenanceBanner";
import { CartSync } from "@/components/cart/CartSync";

export default function StorefrontLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-1 flex-col">
      <CartSync />
      {/* SITE-01: bagian ini membaca pengaturan platform, jadi di-stream di
          dalam Suspense supaya layout dan halaman tetap bisa diprerender. */}
      <Suspense fallback={null}>
        <MaintenanceBanner />
      </Suspense>
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}
