import Navbar from "@/components/layout/Navbar";
import CreateCommunityForm from "./CreateCommunityForm";

export default function NewCommunityPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <section className="pt-32 px-6">
        <div className="max-w-3xl mx-auto">

          <h1 className="text-5xl font-extrabold">
            Create <span className="text-purple-500">Community</span>
          </h1>

          <p className="text-gray-400 mt-4">
            Fill out the information below to add a new community.
          </p>

          <CreateCommunityForm />

        </div>
      </section>
    </main>
  );
}