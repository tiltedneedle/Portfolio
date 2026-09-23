import { PortalNav } from "@/components/portal/PortalNav";
import { PortalFooter } from "@/components/portal/PortalFooter";

export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <PortalNav />
      <main>{children}</main>
      <PortalFooter />
    </>
  );
}
