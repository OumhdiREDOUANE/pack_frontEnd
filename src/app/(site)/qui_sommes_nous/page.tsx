// app/qui-sommes-nous/page.tsx
import QuiSommesNous from "./QuiSommesNous";
import type { Metadata } from "next";
import Script from "next/script";
export const metadata: Metadata = {
  title: "Packspace - Imprimerie 100% digitale | Qui sommes-nous",
  description:
    "Découvrez Packspace, une imprimerie 100% digitale alliant expertise de l'impression et modernité du web. Rapidité, qualité et innovation pour vos projets.",
  keywords: ["imprimerie digitale", "Packspace", "impression en ligne", "Maroc", "impression rapide"],
  openGraph: {
    title: "Packspace - Imprimerie 100% digitale",
    description:
      "Imprimerie 100% digitale au Maroc. Donnez vie à vos créations en un simple clic !",
   
    siteName: "Packspace",
    
   
   
    type: "website",
  },
  
};

export default function Page() {
  return <>
      {/* Structured Data JSON-LD for SEO */}
      <Script type="application/ld+json" id="structured-data">
        {`
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Packspace",
          
          "sameAs": [
            "https://www.instagram.com/packspacee.ma",
            "https://www.facebook.com/profile.php?id=61566310341357",
            "https://www.linkedin.com/company/packspace-ma"
          ],
          "description": "Packspace est une imprimerie 100% digitale au Maroc. Rapidité, qualité et innovation pour tous vos projets d'impression."
        }
        `}
      </Script>

     
  <QuiSommesNous />
  </>
}
