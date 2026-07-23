import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;


  const article = await prisma.news.findUnique({
    where: {
      slug,
    },
  });



  if (!article || !article.published) {
    notFound();
  }



  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />


      <section className="pt-32 pb-24 px-6">

        <div className="max-w-4xl mx-auto">


          {article.image && (

            <div className="w-full h-72 relative rounded-2xl overflow-hidden mb-10">

              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
              />

            </div>

          )}



          <h1 className="text-6xl font-extrabold">
            {article.title}
          </h1>



          <p className="text-purple-400 mt-6">
            {new Date(article.createdAt).toLocaleDateString()}
          </p>



          <div className="mt-10 text-gray-300 text-lg leading-relaxed whitespace-pre-line">

            {article.content}

          </div>


        </div>

      </section>


      <Footer />

    </main>
  );
}