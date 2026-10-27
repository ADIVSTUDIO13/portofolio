import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fakhri Arya Dzaki - Portofolio & Sertifikat Resmi",
    short_name: "Porto Arya",
    description:
      "Portofolio digital resmi Fakhri Arya Dzaki, Siswa RPL SMKN 71 Jakarta. Full Stack Web Developer & Administrator Server VPS Linux.",
    start_url: "/",
    display: "standalone",
    background_color: "#080c14",
    theme_color: "#080c14",
    lang: "id",
    icons: [
      {
        src: "/images/fechat.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/fechat.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
