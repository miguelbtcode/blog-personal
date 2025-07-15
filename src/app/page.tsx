import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Bienvenido a mi blog personal. Aquí encontrarás artículos sobre tecnología, desarrollo web y más.",
};

export default async function HomePage() {
  return (
    <>
      <main className="flex-1"></main>
    </>
  );
}
