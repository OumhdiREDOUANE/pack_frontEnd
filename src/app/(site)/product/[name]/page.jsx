import ProductSection from "./components/AllSection";
import { notFound } from "next/navigation";
import Script from "next/script";
// helper function to fetch data
async function fetchData(url, errorMessage) {
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      if (res.status === 404) notFound();
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    throw new Error(`${errorMessage}`);
  }
}
export async function generateMetadata({ params }) {
  const API_URL = process.env.API_URL || "http://127.0.0.1:8000";
  const { name } = await params;
  

  // اجلب المنتج لاستخدامه في الـ meta
  const product = await fetchData(
    `${API_URL}/api/product/${decodeURIComponent(name)}`,
    "Failed to fetch product for SEO"
  );

  return {
    title: `${product.name_product} | Packspace`,
    description: product.description_product || "Imprimerie 100% digitale - Packspace",
    openGraph: {
      title: `${product.name_product} | Packspace`,
      description: product.description_product || "Imprimerie 100% digitale - Packspace",
     
    },
   
  };
}

export default async function ProductPage({ params }) {
  const API_URL = process.env.API_URL || "http://127.0.0.1:8000";
  const { name } = await params;
console.log(decodeURIComponent(name))
  // fetch product
  const product = await fetchData(
    `${API_URL}/api/product/${decodeURIComponent(name)}`,
    "Failed to fetch product"
  );

  // fetch images only if product exists
  let images = [];
  if (product?.id_product) {
    images = await fetchData(
      `${API_URL}/api/images/product/${product.id_product}`,
      "Failed to fetch images"
    );
  }

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
  <ProductSection product={product} images={images} />
  </>
}
