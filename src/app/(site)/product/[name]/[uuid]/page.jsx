
import ProductSection from "./components/AllSection"

import { notFound } from "next/navigation";


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
console.log(name)
  let images;
  let res;
  try {
    res = await fetch(`${API_URL}/api/product/${decodeURIComponent(name)}`, {
      next: { revalidate: 60 },
    });
  } catch (error) {
    throw new Error(`Impossible de joindre l'API`);
  }

  if (!res.ok) {
    if (res.status === 404) {
      
      throw new Error(`Failed to fetch product`);
    }
  }
  const product = await res.json();
if(product.id_product){
  let reponse;
  try {
    reponse = await fetch(`${API_URL}/api/images/product/${product.id_product}`, {
      next: { revalidate: 60 },
    });
  } catch (error) {
    throw new Error(`Impossible de joindre l'API`);
  }

  if (!reponse.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error(`Failed to fetch product`);
  }

   images = await reponse.json();
}else{
  images=[]
}

  return <ProductSection product={product} images={images} />;
}