import Navbar from "@/components/layout/NavbarWrapper";
import CreateEventForm from "./CreateEventForm";

export default function CreateEventPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <section className="pt-32 px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold">
            Create{" "}
            <span className="text-purple-500">
              Event
            </span>
          </h1>

          <p className="text-gray-400 mt-4">
            Create a new event for the Nexus community.
          </p>

          <CreateEventForm />
        </div>
      </section>
    </main>
  );
}