import { prisma } from "@/lib/prisma";
import RoleSelector from "./RoleSelector";
import { requireRole } from "@/lib/auth";

export default async function UsersPage() {

  await requireRole([
    "OWNER"
  ]);


  const users = await prisma.user.findMany({

    orderBy: {
      username: "asc",
    },

  });



  return (

    <section className="pt-10 px-6">

      <div className="max-w-6xl mx-auto">


        <h1 className="text-5xl font-extrabold">

          Manage 
          <span className="text-purple-500">
            {" "}Users
          </span>

        </h1>


        <p className="text-gray-400 mt-4">

          Manage user roles and permissions.

        </p>



        <div className="grid gap-6 mt-12">


          {users.length === 0 && (

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-gray-400">

              No users found.

            </div>

          )}



          {users.map((user) => (

            <div

              key={user.id}

              className="
              bg-white/5
              border
              border-white/10
              rounded-2xl
              p-6
              flex
              items-center
              justify-between
              "

            >



              <div className="flex items-center gap-5">


                <img

                  src={user.image || "/default-avatar.png"}

                  alt={user.username}

                  className="
                  w-16
                  h-16
                  rounded-full
                  border
                  border-purple-500
                  "

                />



                <div>


                  <h2 className="text-2xl font-bold">

                    {user.username}

                  </h2>



                  <p className="text-gray-400 mt-1">

                    Discord ID: {user.discordId}

                  </p>



                  <p className="text-purple-400 mt-1">

                    Current Role: {user.role}

                  </p>


                </div>


              </div>





              <div className="text-right">


                <p className="text-sm text-gray-400 mb-2">

                  Change Role

                </p>



                <RoleSelector

                  userId={user.id}

                  role={user.role}

                />


              </div>



            </div>


          ))}



        </div>


      </div>


    </section>

  );

}