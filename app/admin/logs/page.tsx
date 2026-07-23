import Navbar from "@/components/layout/NavbarWrapper";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";


export default async function LogsPage() {

  await requireRole([
    "OWNER"
  ]);


  const logs = await prisma.auditLog.findMany({

    orderBy: {
      createdAt: "desc",
    },

    include: {
      user: true,
    },

  });



  return (

    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />


      <section className="pt-32 px-6">

        <div className="max-w-6xl mx-auto">


          <h1 className="text-5xl font-extrabold">
            Activity <span className="text-purple-500">Logs</span>
          </h1>


          <p className="text-gray-400 mt-4">
            See all important actions made by staff.
          </p>



          <div className="grid gap-5 mt-12">


            {logs.length === 0 && (

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-gray-400">

                No activity logs yet.

              </div>

            )}



            {logs.map((log) => (

              <div

                key={log.id}

                className="bg-white/5 border border-white/10 rounded-2xl p-6"

              >

                <div className="flex justify-between">


                  <div>

                    <h2 className="text-xl font-bold">

                      🛡 {log.action}

                    </h2>


                    <p className="text-purple-400 mt-2">

                      Target: {log.target}

                    </p>


                    <p className="text-gray-300">

                      {log.details}

                    </p>


                  </div>



                  <div className="text-right text-sm text-gray-400">

                    <p>
                      By: {log.user?.username || "Unknown"}
                    </p>


                    <p>
                      {new Date(log.createdAt).toLocaleString()}
                    </p>


                  </div>


                </div>


              </div>

            ))}



          </div>


        </div>

      </section>


    </main>

  );
}