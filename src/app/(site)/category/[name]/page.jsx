// app/category/page.jsx
import Link from 'next/link';

async function fetchProductsByCategory(name) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const res = await fetch(`${API_BASE_URL}/api/categories/${name}`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  const response = await res.json();
  return response.data || [];
}

export default async function CategoryPage({ params }) {
  const { name } = params;

  let products = [];
  try {
    products = await fetchProductsByCategory(name);
  } catch (error) {
    return (
      <div className="font-sans text-center py-20 text-red-500 text-lg">
        Erreur lors du chargement des produits
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 font-sans">
      {/* Banner */}
      <div className="mb-8">
        <img
          src="/slide2.jpg"
          alt="Banner"
          className="w-full h-auto object-cover rounded-lg"
        />
      </div>

      {/* Category Title */}
      <h2 className="text-[#006294] text-2xl sm:text-3xl text-center font-semibold my-9 tracking-wide">
        {name === 'h%C3%B4tellerie-restauration' ? "Hôtellerie / Restauration" : name}
      </h2>

      {/* Products */}
      {products.length === 0 ? (
        <p className="text-center text-gray-500 text-base sm:text-lg py-10">
          Aucun produit trouvé dans cette catégorie.
        </p>
      ) : (
        <div className="flex flex-wrap -mx-2">
          {products.map((prod) => (
            <div key={prod.id_product} className="w-full sm:w-1/2 md:w-1/4 px-2 mb-6">
              <div className="flex flex-col h-full bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                {/* Product Image */}
                <img
                  src={name === "all"
                    ? prod.main_image ?? '/placeholder.jpg'
                    : prod.image_product?.[0]?.url_image ?? '/placeholder.jpg'}
                  alt={prod.name_product}
                  className="w-full h-[225px] object-cover"
                />

                {/* Product Name */}
                <h3 className="text-center text-[#333] font-semibold text-lg py-4 px-2">
                  <Link
                    href={`/product/${encodeURIComponent(prod.name_product)}`}
                    className="hover:text-[#C09200] transition-colors duration-200"
                  >
                    {prod.name_product}
                  </Link>
                </h3>

                {/* Action Button */}
                <div className="flex-1 flex flex-col justify-end px-4 pb-4">
                  <Link
                    href={`/product/${encodeURIComponent(prod.name_product)}`}
                    className="bg-[#006294] hover:bg-[#C09200] text-white text-center py-2 rounded-md font-semibold transition-colors duration-300"
                  >
                    Commander
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
