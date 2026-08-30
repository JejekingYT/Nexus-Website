import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AppearanceSettings from "./AppearanceSettings";

export default async function AppearanceSettingsPage() {
const session = await getServerSession(authOptions);

if (!session?.user?.id) {
redirect("/login");
}

return ( <main className="min-h-screen text-white"> <Navbar />

  <AppearanceSettings />

  <Footer />
</main>

);
}
