import Navbar from "@/components/layout/Navbar";
import CreateNewsForm from "./CreateNewsForm";
import { requireRole } from "@/lib/auth";

export default async function NewNewsPage() {

  await requireRole([
    "OWNER",
    "ADMIN",
  ]);


  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />


      <section className="pt-32 px-6">

        <div className="max-w-3xl mx-auto">


          <h1 className="text-5xl font-extrabold">

            Create 
            <span className="text-purple-500">
              {" "}News
            </span>

          </h1>



          <p className="text-gray-400 mt-4">

            Create a new Nexus announcement.

          </p>



          <CreateNewsForm />


        </div>


      </section>


    </main>
  );
}