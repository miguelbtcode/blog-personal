import { cn } from "@/lib/utils";

interface HeroBannerProps {
  className?: string;
}

export function HeroBanner({ className }: HeroBannerProps) {
  return (
    <section
      className={cn(
        "bg-gradient-to-br from-[#466853] via-[#5a7c68] to-[#795F54]",
        className
      )}
    >
      <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenido principal */}
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Código, café y conocimiento
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Reflexiones desde las trincheras del desarrollo. Comparto lo que
              aprendo, los errores que cometo y las soluciones que funcionan en
              proyectos reales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-[#466853] px-8 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors">
                Leer artículos
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-[#466853] transition-colors">
                Suscríbete
              </button>
            </div>
          </div>

          {/* Perfil y tecnologías */}
          <div className="lg:justify-self-end relative">
            <div className="relative w-80 h-80 mx-auto">
              {/* Foto de perfil centrada */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-32 h-32 rounded-full overflow-hidden profile-image border-4 border-white shadow-2xl">
                  <img
                    src="/hero/profile.png"
                    alt="Perfil"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Tecnologías orbitando */}
              {/* .NET - Top */}
              <div className="tech-icon absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <img
                  src="/dotnet-logo.png"
                  alt=".NET"
                  className="w-8 h-8 object-contain rounded-md"
                />
              </div>

              {/* Azure - Top Right */}
              <div className="tech-icon absolute top-8 right-8 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <img
                  src="/azure-logo.png"
                  alt="Azure"
                  className="w-8 h-8 object-contain rounded-md"
                />
              </div>

              {/* AWS - Right */}
              <div className="tech-icon absolute top-1/2 right-0 transform -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <img
                  src="/aws-logo.png"
                  alt="AWS"
                  className="w-8 h-8 object-contain rounded-md"
                />
              </div>

              {/* SQL Server - Bottom Right */}
              <div className="tech-icon absolute bottom-8 right-8 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <img
                  src="/sqlserver-logo.png"
                  alt="SQL Server"
                  className="w-8 h-8 object-contain rounded-md"
                />
              </div>

              {/* PostgreSQL - Bottom */}
              <div className="tech-icon absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <img
                  src="/postgresql-logo.png"
                  alt="PostgreSQL"
                  className="w-8 h-8 object-contain rounded-md"
                />
              </div>

              {/* MongoDB - Bottom Left */}
              <div className="tech-icon absolute bottom-8 left-8 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <img
                  src="/mongodb-logo.png"
                  alt="MongoDB"
                  className="w-8 h-8 object-contain rounded-md"
                />
              </div>

              {/* React - Left */}
              <div className="tech-icon absolute top-1/2 left-0 transform -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <img
                  src="/react-logo.png"
                  alt="React"
                  className="w-8 h-8 object-contain rounded-md"
                />
              </div>

              {/* Next.js - Top Left */}
              <div className="tech-icon absolute top-8 left-8 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <img
                  src="/nextjs-logo.png"
                  alt="Next.js"
                  className="w-8 h-8 object-contain rounded-md"
                />
              </div>

              {/* Círculos decorativos de fondo */}
              <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
              <div className="absolute inset-4 border border-white/10 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
