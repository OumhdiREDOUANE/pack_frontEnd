"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Cookies from "js-cookie";

const FlyerFormat = ({ product, onDetailsProprieterChange }) => {
  const router = useRouter();
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [prixUnitaire, setprixUnitaire] = useState(0);
  const [ancienPrix, setAncienPrix] = useState(0);
  const [prixTotal, SetPrixTotal] = useState(0);
  const [economie, setEconomie] = useState(0);
  const [missingOptions, setMissingOptions] = useState([]);
  const [dataPost, setDataPost] = useState([]);
  const [promo_code, setPromo_code] = useState(0);
  const [orderData, setOrderData] = useState();
  const [DetailsState, setDetailsState] = useState([
    { label: "Prix unitaire", value: null },
    { label: "Prix Totale", value: null },
  ]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const toggleFormat = (proprieterName, value) => {
    setSelectedFormats((prev) => {
      if (prev[proprieterName] === value) return prev;
      return { ...prev, [proprieterName]: value };
    });
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/setting`);
        const data = await res.json();
        setPromo_code(data.promo_code);
      } catch (err) {
        throw new Error("Erreur lors du chargement des commandes");
      }
    };
    fetchSettings();
  }, []);

  function getSession() {
    const sessionId = Cookies.get("session_id");
    const expiry = parseInt(Cookies.get("session_expiry") || "0");
    if (!sessionId || Date.now() > expiry) {
      Cookies.remove("session_id");
      Cookies.remove("session_expiry");
      return null;
    }
    return sessionId;
  }
  const sessionId = getSession();

  const calculatePrices = () => {
    if (!product?.proprieter) return { unitPrice: 0, totalPrice: 0 };
    const quantiteProprieter = product.proprieter.find(
      (p) => p.name_proprieter.trim() === "Quantité"
    );
    const firstOptionOfQuantite = quantiteProprieter?.options?.[0];
    let sumPrix = 0;
    product.proprieter.forEach((prop) => {
      const selectedOptionName = selectedFormats[prop.name_proprieter];
      const option =
        prop.options.find((o) => o.name_option === selectedOptionName) ||
        prop.options[0];
      sumPrix += parseFloat(option.prix_optionOfProduct) || 0;
    });
 const quantiteValue = parseFloat(
  selectedFormats["Quantité"] ?? firstOptionOfQuantite?.name_option
) || 1
   const unitPrice = (sumPrix / quantiteValue).toFixed(2);
const totalPrice = sumPrix.toFixed(2);
return { unitPrice: parseFloat(unitPrice), totalPrice: parseFloat(totalPrice) };

  };

  useEffect(() => {
    const baseDetails = [
      { label: "Prix unitaire", value: prixUnitaire ? `${prixUnitaire} DH HT` : null },
      { label: "Prix Totale", value: prixTotal ? `${prixTotal} DH HT` : null },
    ];
    if (product?.proprieter) {
      const proprieterDetails = product.proprieter.map((prop) => ({
        label: prop.name_proprieter,
        value: "-",
      }));
      setDetailsState([...proprieterDetails, ...baseDetails]);
      onDetailsProprieterChange([...proprieterDetails, ...baseDetails]);
    }
  }, [product]);

  useEffect(() => {
  if (product?.proprieter) {
    const { unitPrice, totalPrice } = calculatePrices();
    const unit = parseFloat(unitPrice).toFixed(2);
    let total = parseFloat(totalPrice).toFixed(2);
    let ancien = 0;
    let eco = 0;

    if (promo_code > 0) {
      ancien = parseFloat(totalPrice).toFixed(2);
      eco = parseFloat( totalPrice - totalPrice * promo_code).toFixed(2);
      total = parseFloat(totalPrice * promo_code).toFixed(2);
    }

    setprixUnitaire(unit);
    setAncienPrix(ancien);
    setEconomie(eco);
    SetPrixTotal(total);

 
  }
}, [product, selectedFormats,promo_code]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    const { unitPrice, totalPrice } = calculatePrices();
    const updated = DetailsState.map((item) =>
      item.label === name ? { ...item, value } : item
    );
    const updatedWithPrices = updated.map((item) => {
      if (item.label === "Prix unitaire")
        return { ...item, value: `${unitPrice} DH HT` };
      if (item.label === "Prix Totale")
        if (promo_code > 0) {
        return { ...item, value: `${parseFloat(totalPrice * promo_code).toFixed(2)} DH HT` };
        }
       
      return item;
    });
    setDetailsState(updatedWithPrices);
    onDetailsProprieterChange(updatedWithPrices);
  };

  const handleAddToCart = (e) => {
    if (!product?.proprieter) return;
    const missing = product.proprieter
      .filter((prop) => !selectedFormats[prop.name_proprieter])
      .map((prop) => prop.name_proprieter);
    if (missing.length > 0) {
      e.preventDefault();
      setMissingOptions(missing);
      return true;
    }
    setMissingOptions([]);
    return false;
  };

  const handleSelectOption = (proprieterName, id_ProductOption) => {
    setDataPost((prev) => ({
      ...prev,
      [proprieterName]: id_ProductOption,
    }));
  };
  

  const handleSubmit = async (e) => {
    const hasMissing = handleAddToCart(e);
    if (hasMissing) return;

    try {
      const payload = {};
      Object.keys(dataPost).forEach((key, index) => {
        payload[`selected_option_${index + 1}`] = dataPost[key];
      });
          const prixTotaleItem = DetailsState.find(
  (item) => item.label === "Prix Totale"
);

payload.prix_orderProduct = parseFloat(prixTotaleItem.value)
  
      const response = await fetch(`${API_BASE_URL}/api/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Erreur lors du chargement des commandes");
    } catch (error) {
      throw new Error("Erreur lors du chargement des commandes");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      <h1 className="text-3xl font-bold text-black mb-6">{product.name_product}</h1>
      <p className="text-justify text-sm text-gray-700 mb-8">{product.description_product}</p>

      <form method="post"  >
        {product.proprieter.map((proprieter) => (
          <div
            key={proprieter.name_proprieter}
            className="bg-white rounded-md hover:shadow-[2px_2px_10px_rgba(50,50,50,0.2)] p-2 pb-4 mb-3"
          >
            <div className="flex items-center mb-4">
              <h4 className="text-lg font-semibold pr-3">{proprieter.name_proprieter}</h4>
              <Popover>
                <PopoverTrigger asChild>
                  <img
                    src="/interrogation.png"
                    alt="?"
                    className="w-5 h-5 cursor-pointer hover:opacity-80 transition"
                  />
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="center"
                  className="w-64 p-3 rounded-xl shadow-md bg-white border text-sm"
                >
                  <h5 className="font-semibold text-gray-800 mb-2">À propos</h5>
                  <p className="text-gray-600 leading-relaxed">{proprieter.description_proprieter}</p>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {proprieter.options.map((option) => {
                const isSelected = selectedFormats[proprieter.name_proprieter] === option.name_option;
                return (
                  <label
                    key={option.id_option}
                    className={`cursor-pointer rounded border p-2 flex flex-col items-center justify-center transition duration-300 ease-in-out shadow-md ${
                      isSelected ? "ring-2 ring-blue-500" : "border-gray-300"
                    }`}
                    onClick={() => {
                      toggleFormat(proprieter.name_proprieter, option.name_option);
                      handleSelectOption(proprieter.name_proprieter, option.id_ProductOption);
                    }}
                  >
                    <input
                      type="checkbox"
                      name={proprieter.name_proprieter}
                      value={option.name_option}
                      checked={isSelected}
                      onChange={(e) => {
                        toggleFormat(proprieter.name_proprieter, option.name_option);
                        handleChange(e);
                        handleSelectOption(proprieter.name_proprieter, option.id_ProductOption);
                      }}
                      className="hidden"
                    />
                    <img src={option.image_option} alt={option.name_option} className="w-24 mb-2" />
                    <span className="text-sm text-center">{option.name_option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* Prix */}
        <div className="w-full py-4 mt-3">
          <div className="flex justify-between w-full bg-[#f4f9fb] items-center p-3 mb-1">
            <span className="text-[#6071e5] font-medium">Prix unitaire</span>
            <span className="text-[#6071e5] font-bold">{Number(prixUnitaire).toFixed(2)} Dhs </span>
          </div>

          <div className="flex flex-col p-3 pt-1 bg-[#f4f9fb] w-full">
            <span className="line-through text-gray-400 text-lg pb-2"> {Number(ancienPrix).toFixed(2)} Dhs </span>
            <div className="flex justify-between items-center">
              <span className="text-[#6071e5] font-bold text-lg">
                Total{" "}
                <span className="text-sm text-gray-500 font-normal">({Number(economie).toFixed(2)} Dhs  )</span>
              </span>
              <span className="text-[#6071e5] font-bold text-lg">  {Number(prixTotal).toFixed(2)} Dhs </span>
            </div>
          </div>

          <button
          onClick={handleSubmit}
            type="submit"
            className="mt-4 w-full hover:bg-[#006294] hover:text-[#C09200] bg-[#C09200] text-[#FFFFFF] py-3 rounded transition-colors"
          >
            AJOUTER AU PANIER
          </button>

          {missingOptions.length > 0 && (
            <p className="text-red-600 text-sm mt-2">
              Merci de choisir les autres options :{" "}
              {missingOptions.map((opt, i) => (
                <span key={i} className="font-semibold">
                  {opt}
                  {i < missingOptions.length - 1 ? " / " : "."}
                </span>
              ))}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default FlyerFormat;
