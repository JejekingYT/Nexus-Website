import NavbarWrapper from "@/components/layout/NavbarWrapper";
import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
return ( <main className="min-h-screen bg-[#09090B] text-white"> <NavbarWrapper />

  <Suspense
    fallback={
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold">
              Reset your{" "}
              <span className="text-purple-500">
                password
              </span>
            </h1>

            <p className="text-gray-400 mt-4">
              Loading reset link...
            </p>
          </div>
        </div>
      </section>
    }
  >
    <ResetPasswordClient />
  </Suspense>
</main>

);
}
