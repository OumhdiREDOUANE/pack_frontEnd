// FullPage.js
import Home from './page';

// Next.js Server Component أو Client Component حسب حاجتك
// SEO dynamic
export async function generateMetadata() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // جلب بيانات الإعدادات أو Hero Image
  let heroImage = "";
  try {
    const resSettings = await fetch(`${API_BASE_URL}/api/setting`);
    const settings = await resSettings.json();
    heroImage = settings.url_image_hero || "";
  } catch (err) {
    console.error("Erreur lors du chargement des paramètres pour SEO", err);
  }

  return {
    title: "PackSpace - Impression Cartes de Visite et Best Sellers",
    description:
      "Découvrez les cartes de visite d'exception et les best-sellers PackSpace avec finitions luxe et dorure à chaud.",
    openGraph: {
      title: "PackSpace - Cartes de Visite & Best Sellers",
      description:
        "Découvrez les cartes de visite d'exception et les best-sellers PackSpace avec finitions luxe et dorure à chaud.",
    
      siteName: "PackSpace",
      images: [
        {
          url: heroImage ,
          width: 1200,
          height: 630,
          alt: "PackSpace Hero",
        },
      ],
  
      type: "website",
    },
    
  };
}

export default async function FullPage() {
  // جلب البيانات من API
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

  const res = await fetch(`${API_BASE_URL}/api/categories`, {
    next: { revalidate: 60 }, // إعادة التحقق كل 60 ثانية
  });
  const response = await res.json();

  // تحويل البيانات لتضمين الصور والـ slug
  const categories = response.data.map((cat) => ({
    id: cat.id_categorie,
    name: cat.name_categorie,
    slug: cat.name_categorie ,
    img: cat.url, // تأكد أن API ترجع image_categorie

  }));
  console.log(categories)
const resProducts = await fetch(`${API_BASE_URL}/api/product/topProducts`, {
    next: { revalidate: 60 },
  });
  if (!resProducts.ok)      throw new Error("Erreur lors du chargement des commandes");
  const responseProducts = await resProducts.json();

  const topProducts = responseProducts.data.map((prod) => ({
    id: prod.id_product,
    title: prod.name_product,
    desc: prod.description_product,
    img: prod.image?.url_image ?? '', // image_resource ترجع url
    price: prod.max_prix,       // أعلى سعر للطلب
  }));

  return <Home categories={categories} products={topProducts} />;
}
