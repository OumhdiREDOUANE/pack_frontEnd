"use client"

import { useState ,useEffect} from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from 'next/link'

export default function Home({ categories, products }) {
    const [url_image_hero, setUrl_image_hero] = useState(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch settings
        const resSettings = await fetch(`${API_BASE_URL}/api/setting`);
        const dataSettings = await resSettings.json();
        setUrl_image_hero(dataSettings.url_image_hero || null);

        // Fetch products
        const resProducts = await fetch(`${API_BASE_URL}/api/products`);
        const dataProducts = await resProducts.json();
        setProducts(dataProducts || []);

        // Fetch categories
        const resCategories = await fetch(`${API_BASE_URL}/api/categories`);
        const dataCategories = await resCategories.json();
        setCategories(dataCategories || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [API_BASE_URL])

  return (
    <>
      {/* Hero Section */}
      <div
        className="group relative w-full h-[499px] md:h-[419px] lg:h-[427px] flex flex-col justify-center items-end overflow-hidden bg-cover bg-center  z-10"
        style={{
          backgroundImage: url_image_hero
            ? `url(${url_image_hero})`
            : "linear-gradient(to right, #006294, #004f72)", // fallback color
        }}
      >
        <div className="text-white max-w-xl space-y-4 pr-4">
          <h3 className="text-xl md:text-3xl font-bold leading-snug tracking-wider py-2">
            Une image de marque forte commence par une carte de visite d'exception.
          </h3>
          <p className="text-xl md:text-xl font-thin tracking-wide leading-relaxed pb-5">
            Finitions luxe, papiers ultra blancs, dorure à chaud pour un premier contact mémorable.
          </p>
          <button className="bg-[#c39500] hover:bg-[#a67c00] text-white text-lg font-medium leading-loose tracking-wide py-2 px-5 rounded-md transition">
            Commandez des Cartes de Visite
          </button>
        </div>
      </div>
      {/* Best Sellers Section */}
      <section className="py-12 my-[80px] bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-[#006294] font-bold text-center mb-10">
            Les Best-Sellers PackSpace
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.map((product, index) => (
              <div key={index} className="bg-white p-4 duration-300">
                <div className="aspect-square overflow-hidden mb-4">
                  <Link href={`/product/${encodeURIComponent(product.title)}`} className="block">
                    <img
                      src={product.img}
                      alt={product.title}
                      className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
                    />
                  </Link>
                </div>
                <div className="text-center space-y-1 h-[100px]">
                  <h3 className="text-md font-semibold text-[#333333]">
                    <Link href={`/product/${encodeURIComponent(product.title)}`} className="hover:text-[#006294] transition-colors duration-200">
                      {product.title}
                    </Link>
                  </h3>
                  <div className="text-sm text-gray-700">
                    à partir de{" "}
                    <strong className="text-[#006294] font-bold">{product.price}</strong> Dh
                  </div>
                  <div className="text-xs font-medium text-[#C09200]">
                    {product.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-[#006294] mb-10">
          Nos Catégories
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {categories?.map((cat) => (
            <div key={cat.slug} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 flex flex-col items-center">
              <Link
                href={`/category/${cat.slug}`}
                className="block w-full aspect-square overflow-hidden group transition-shadow duration-300 hover:shadow-xl"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <h3 className="mt-4 text-center text-lg font-semibold text-[#333333]">
                <Link href={`/category/${cat.slug}`} className="hover:text-[#006294] transition-colors duration-200">
                  {cat.name}
                </Link>
              </h3>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
