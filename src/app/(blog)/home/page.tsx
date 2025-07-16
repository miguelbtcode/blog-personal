import { Suspense } from "react";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { HomeContent } from "@/frontend/components/home";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-gray-600">Cargando contenido...</p>
            </div>
          </div>
        }
      >
        <HomeContent />
      </Suspense>
    </main>
  );
}
