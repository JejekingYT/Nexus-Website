import Navbar from "./Navbar";
import { getSiteSettings } from "@/lib/settings";

export default async function NavbarWrapper() {

  const settings = await getSiteSettings();


  return (
    <Navbar
      siteName={settings.siteName}
    />
  );

}