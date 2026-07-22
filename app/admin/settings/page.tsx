import Navbar from "@/components/layout/Navbar";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />

      <section className="pt-32 px-6">
        <div className="max-w-5xl mx-auto">

          <h1 className="text-5xl font-extrabold">
            Admin <span className="text-purple-500">Settings</span>
          </h1>

          <p className="text-gray-400 mt-4">
            Manage Nexus website settings here.
          </p>

          <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold">
              Website Settings
            </h2>

            <p className="text-gray-400 mt-3">
              Settings panel coming soon.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}