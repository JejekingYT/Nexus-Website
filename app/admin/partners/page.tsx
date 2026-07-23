import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import {
  createPartner,
  deletePartner,
  approvePartner,
  rejectPartner,
} from "./actions";

export default async function AdminPartnersPage() {

  await requireRole(["OWNER"]);

  const pendingPartners = await prisma.partner.findMany({

  where:{
    status:"PENDING",
  },

  orderBy:{
    createdAt:"desc",
  },

});


const partners = await prisma.partner.findMany({

  where:{
    status:"APPROVED",
  },

  orderBy:{
    createdAt:"desc",
  },

});

  return (

    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />

      <section className="pt-32 pb-24 px-6">

        <div className="max-w-7xl mx-auto">

          <h1 className="text-5xl font-extrabold">

            Partner <span className="text-purple-500">Communities</span>

          </h1>

          <p className="text-gray-400 mt-3">

            OWNER Panel

          </p>

          {/* Create Partner */}

          <form

            action={createPartner}

            className="
            mt-12
            bg-white/5
            border
            border-white/10
            rounded-2xl
            p-8
            space-y-5
            "

          >

            <input
              name="name"
              required
              placeholder="Community Name"
              className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4"
            />

            <input
              name="slug"
              required
              placeholder="Slug (example: sanctuary)"
              className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4"
            />

            <input
              name="logo"
              required
              placeholder="Logo URL"
              className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4"
            />

            <input
              name="banner"
              placeholder="Banner URL"
              className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4"
            />

            <textarea

              name="description"

              required

              placeholder="Description"

              className="
              w-full
              h-32
              bg-black/30
              border
              border-white/10
              rounded-xl
              px-5
              py-4
              "

            />

            <input
              name="discord"
              placeholder="Discord Invite"
              className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4"
            />

            <input
              name="website"
              placeholder="Website"
              className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4"
            />

            <input
              name="roblox"
              placeholder="Roblox Group"
              className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4"
            />

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                name="featured"
              />

              Featured Partner

            </label>

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                name="verified"
                defaultChecked
              />

              Verified Partner

            </label>

            <button

              className="
              bg-purple-600
              hover:bg-purple-700
              px-8
              py-4
              rounded-xl
              font-bold
              "

            >

              Add Partner

            </button>

          </form>

          {/* Pending Applications */}

<h2 className="text-3xl font-bold mt-20">
  Pending Applications
</h2>


<div className="grid lg:grid-cols-2 gap-6 mt-8">


{pendingPartners.map((partner)=>(


<div

key={partner.id}

className="
bg-yellow-500/5
border
border-yellow-500/20
rounded-2xl
p-6
"

>


<div className="flex items-center gap-4">


{partner.logo && (

<img

src={partner.logo}

alt={partner.name}

className="
w-16
h-16
rounded-xl
object-cover
"

/>

)}



<div>

<h3 className="text-2xl font-bold">

{partner.name}

</h3>


<p className="text-gray-500">

/{partner.slug}

</p>

</div>


</div>





<div className="mt-6 space-y-3 text-sm">


<p>

<span className="text-purple-400 font-bold">
Owner:
</span>{" "}

{partner.ownerName}

</p>



<p>

<span className="text-purple-400 font-bold">
Email:
</span>{" "}

{partner.email}

</p>




<p>

<span className="text-purple-400 font-bold">
Members:
</span>{" "}

{partner.members.toLocaleString()}

</p>


</div>







<div className="mt-6">


<h4 className="font-bold text-lg">
Description
</h4>


<p className="text-gray-400 mt-2">

{partner.description}

</p>


</div>






<div className="mt-6">


<h4 className="font-bold text-lg">
Reason for Partnership
</h4>


<p className="text-gray-400 mt-2">

{partner.reason}

</p>


</div>







{partner.socials && (

<div className="mt-6">


<h4 className="font-bold text-lg">
Socials
</h4>


<p className="text-gray-400 mt-2">

{partner.socials}

</p>


</div>

)}








<div className="flex gap-3 mt-8">


<form action={approvePartner}>


<input

type="hidden"

name="id"

value={partner.id}

/>



<button

className="
bg-green-600
hover:bg-green-700
px-5
py-3
rounded-xl
font-bold
"

>

✅ Approve

</button>


</form>








<form action={rejectPartner}>


<input

type="hidden"

name="id"

value={partner.id}

/>



<button

className="
bg-red-600
hover:bg-red-700
px-5
py-3
rounded-xl
font-bold
"

>

❌ Reject

</button>


</form>



</div>



</div>


))}


</div>

          {/* Partner List */}

<h2 className="text-3xl font-bold mt-20">
  Current Partners
</h2>

<div className="grid lg:grid-cols-2 gap-6 mt-8">

  {partners.map((partner) => (

    <div
      key={partner.id}
      className="
      bg-white/5
      border
      border-white/10
      rounded-2xl
      p-6
      "
    >

      <div className="flex justify-between items-center">

        <div>

          <h3 className="text-2xl font-bold">
            {partner.name}
          </h3>

          <p className="text-gray-500 mt-1">
            /{partner.slug}
          </p>

        </div>

        <div className="flex gap-2">

          {partner.featured && (
            <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
              ⭐ Featured
            </span>
          )}

          {partner.verified && (
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
              ✔ Verified
            </span>
          )}

        </div>

      </div>

      {partner.logo && (
        <img
          src={partner.logo}
          alt={partner.name}
          className="w-16 h-16 rounded-xl mt-5 object-cover"
        />
      )}

      <p className="text-gray-400 mt-5">
        {partner.description}
      </p>

      <div className="mt-6 space-y-2 text-sm">

        {partner.discord && (
          <p>
            <span className="text-purple-400">Discord:</span>{" "}
            {partner.discord}
          </p>
        )}

        {partner.website && (
          <p>
            <span className="text-purple-400">Website:</span>{" "}
            {partner.website}
          </p>
        )}

        {partner.roblox && (
          <p>
            <span className="text-purple-400">Roblox:</span>{" "}
            {partner.roblox}
          </p>
        )}

      </div>

      <div className="flex gap-3 mt-8 flex-wrap">

        <a
          href={`/admin/partners/${partner.id}`}
          className="
          bg-blue-600
          hover:bg-blue-700
          px-5
          py-3
          rounded-xl
          font-bold
          "
        >
          Edit
        </a>

        <form
          action={async () => {
            "use server";
            await deletePartner(partner.id);
          }}
        >
          <button
            className="
            bg-red-600
            hover:bg-red-700
            px-5
            py-3
            rounded-xl
            font-bold
            "
          >
            Delete
          </button>
        </form>

      </div>

    </div>

  ))}

</div>

        </div>

      </section>

      <Footer />

    </main>

  );

}