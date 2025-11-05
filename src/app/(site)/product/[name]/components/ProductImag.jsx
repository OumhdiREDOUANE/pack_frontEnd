

"use client";

import { useState ,useRef,useEffect} from "react";
import { ZoomIn } from 'lucide-react';
import PhotoSwipe from "photoswipe";
import "photoswipe/style.css";

import Image from "next/image";
// const details = [
//         { label: "Pelliculage", value: "-" },
//         { label: "Vernis", value: "-" },
//         { label: "Impression", value: "-" },
//         { label: "Format", value: "-" },
//         { label: "Papier", value: "-" },
//         { label: "Quantité", value: "-" },
//       ];

export default function ProductGallery({ DetailsProprieter,images }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const galleryRef = useRef(null);
  
  const openGallery = () => {
    const pswp = new PhotoSwipe({
      dataSource: images.map((img) => ({
        src: img.url,
        width: 566,
        height: 566
      })),
      index: images.findIndex((img) => img.url === selectedImage.url),
    });

    pswp.init();
  };
  
   
  return (<>
     <div>
      {/* Images */}
      <div
        className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:gap-7 h-fit"
        ref={galleryRef}
      >
        {/* Thumbnails */}
        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto pb-2 px-2 border-b md:border-r border-gray-300 md:h-[385px]">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`cursor-pointer border-2 overflow-hidden transition ${
                selectedImage.url === img.url
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
            >
              <img
                src={img.url}
                alt={`thumb-${idx}`}
                width={69}
                height={69}
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div className="w-full text-center">
          <button onClick={openGallery} className="relative group cursor-pointer">
            <img
              src={selectedImage.url}
              alt="Flyer"
              width={457} 
              height={625}
             className="mx-auto object-contain"
            />
            <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-40 transition-opacity bg-transparent">
              <span className="flex items-center gap-2 text-white text-sm font-medium mb-3 px-4 py-1 bg-black bg-opacity-20 rounded-md">
                <ZoomIn className="w-5 h-5 text-white" />
                Cliquer pour agrandir
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Table → يظهر فقط في الـdesktop */}
      <div className="hidden md:block">
        
        <table className="w-full text-sm border-collapse font-sans">
  <tbody>
    {DetailsProprieter?.map((item, index) =>
      item.value != null ? (
        <tr key={index} className="border-b border-gray-200 font-sans">
          <td className="font-semibold p-2 w-1/3 font-sans">{item.label}</td>
          <td className="p-2 text-center font-sans">{item.value}</td>
        </tr>
      ) : null
    )}
  </tbody>
</table>

      
      </div>
    </div>

</>
) 
}
     
