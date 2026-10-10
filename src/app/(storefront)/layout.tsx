import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CartSync } from "@/components/cart/CartSync";

export default function StorefrontLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-1 flex-col">
      <CartSync />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
