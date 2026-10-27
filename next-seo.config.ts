import type { DefaultSeoProps } from "next-seo/pages";

export const defaultSEOConfig: DefaultSeoProps = {
  defaultTitle: "Fakhri Arya Dzaki - Portofolio Web Developer & Server Admin | Siswa RPL SMKN 71 Jakarta",
  titleTemplate: "%s | Fakhri Arya Dzaki",
  description:
    "Portofolio resmi Fakhri Arya Dzaki, Siswa Rekayasa Perangkat Lunak (RPL) SMKN 71 Jakarta. Full Stack Web Developer & Administrator Server VPS Linux Ubuntu.",
  canonical: "https://www.myportofolioarya.my.id",
  openGraph: {
    type: "profile",
    locale: "id_ID",
    url: "https://www.myportofolioarya.my.id",
    siteName: "Portofolio & Sertifikat Resmi Fakhri Arya Dzaki",
    images: [
      {
        url: "https://www.myportofolioarya.my.id/images/fechat.png",
        width: 1200,
        height: 630,
        alt: "Portofolio & Sertifikat Fakhri Arya Dzaki - Siswa RPL SMKN 71 Jakarta",
      },
    ],
  },
  twitter: {
    handle: "@fakhriaryadzaki",
    site: "@fakhriaryadzaki",
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    {
      name: "author",
      content: "Fakhri Arya Dzaki",
    },
    {
      name: "geo.region",
      content: "ID-JK",
    },
    {
      name: "geo.placename",
      content: "Jakarta Timur",
    },
  ],
};

export default defaultSEOConfig;
