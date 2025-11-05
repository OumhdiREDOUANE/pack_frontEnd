"use client";
import { useEffect, useRef, useState } from "react";
import ProductGallery from "./ProductImag";
import FlyerFormat from "./ProductProprieter";

export default function ProductPage({ product ,images}) {
  const flyerRef = useRef(null);
  const galleryRef = useRef(null);
  const [scrollPassed, setScrollPassed] = useState(false);
  const [DetailsProprieter, setDetailsProprieter] = useState(null);
  useEffect(() => {
    const onScroll = () => {
      if (!flyerRef.current) return;

      const scrollTop = window.scrollY;
      const flyerHeight = flyerRef.current.offsetHeight;

      if (scrollTop >= flyerHeight) {
        setScrollPassed(true);
      } else {
        setScrollPassed(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
     <div className="flex flex-col md:flex-row my-7 gap-6 md:gap-[30px]">
      {/* Gallery Section */}
      <div
        ref={galleryRef}
        className={`w-full md:w-6/12 ${
          scrollPassed ? "relative" : "md:sticky md:top-0"
        }`}
        style={{ alignSelf: "start" }}
      >
        <ProductGallery DetailsProprieter={DetailsProprieter} images={images} />
      </div>

      {/* Flyer Format Section */}
      <div ref={flyerRef} className="w-full md:w-6/12">
        <FlyerFormat
          product={product}
          onDetailsProprieterChange={(details) =>
            setDetailsProprieter(details)
          }
        />

        {/* Table → يظهر فقط في الموبايل */}
        <div className="block md:hidden mt-6">
          <table className="w-full mb-3 text-sm">
            <tbody>
              {DetailsProprieter?.map(
                (item, index) =>
                  item.value != null && (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="font-semibold p-2 w-1/3">{item.label}</td>
                      <td className="p-2 text-center">{item.value}</td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
          
        </div>
      </div>
    </div>
    </>
  );
}
