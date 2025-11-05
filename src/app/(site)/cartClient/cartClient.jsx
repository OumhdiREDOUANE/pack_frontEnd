"use client";

import { useEffect, useState } from "react";
import { Trash2, Edit, Copy, Save } from "lucide-react";
import Cookies from "js-cookie";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/navigation";
import { useAuth } from "src/app/components/AuthProvider";

const fetcher = (url, token) =>
  fetch(url, {
    headers: token ? { "Authorization": `Bearer ${token}` } : {},
  }).then((res) => res.json());

export default function CartClient({ sessionId, orders, token }) {
  const { isLoggedIn } = useAuth();
  const [showDetails, setShowDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [dataOfOrders, setDataOfOrders] = useState(orders || []);
  const [loadingItems, setLoadingItems] = useState({});
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const url = sessionId
    ? token
      ? `${API_BASE_URL}/api/cart/${sessionId}`
      : `${API_BASE_URL}/api/cart/notLogin/${sessionId}`
    : null;

  const { data } = useSWR(url, (url) => fetcher(url, token), {
    fallbackData: orders,
    refreshInterval: 5000,
  });

  useEffect(() => {
    if (data) {
      setDataOfOrders(data);
      setLoading(false);
    }
  }, [data]);

  const handleDelete = async (id_orderProduct) => {
    try {
      const sessionId = Cookies.get("session_id");
      const response = await fetch(`${API_BASE_URL}/api/cart/notLogin/${id_orderProduct}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
      });
      if (!response.ok) throw new Error("Erreur suppression");
      setDataOfOrders((prev) => ({
        ...prev,
        data: prev.data.filter((order) => order.id_orderProduct !== id_orderProduct),
      }));
      mutate(url);
    } catch (error) {
      throw new Error("Erreur lors du chargement des commandes");
    }
  };

  const handleEdit = (order) => {
    sessionStorage.setItem("orderData", JSON.stringify(order));
    router.push(`/product/${order.product.name_product}/${order.uuid}`);
  };

  const handleSave = async (id_orderProduct) => {
    if (!isLoggedIn) {
      alert("Veuillez vous connecter pour sauvegarder");
      router.push("/login");
      return;
    }
    try {
      const sessionId = Cookies.get("session_id");
      const response = await fetch(`${API_BASE_URL}/api/save/${id_orderProduct}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId,
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erreur sauvegarde");
      mutate(url);
    } catch {
      throw new Error("Erreur lors du chargement des commandes");
    }
  };

  const handleSubmit = async (id_orderProduct) => {
    try {
      setLoadingItems((prev) => ({ ...prev, [id_orderProduct]: true }));
      const sourceOrders = dataOfOrders?.data || [];
      const order = sourceOrders.find((o) => o.id_orderProduct === id_orderProduct);
      if (!order) return;
      const payload = {};
      order.product.proprieter.forEach((item, index) => {
        payload[`selected_option_${index + 1}`] = item.options.id_ProductOption;
      });
      payload.prix_orderProduct = order.prix_total;

      const sessionId = Cookies.get("session_id");
      const response = await fetch(`${API_BASE_URL}/api/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setLoadingItems((prev) => ({ ...prev, [id_orderProduct]: false }));
        return;
      }

      const data = await response.json();
      if (data.success === true) {
        mutate(`${API_BASE_URL}/api/cart/notLogin/${sessionId}`);
        setLoadingItems((prev) => ({ ...prev, [id_orderProduct]: false }));
      }
    } catch {
      setLoadingItems((prev) => ({ ...prev, [id_orderProduct]: false }));
    }
  };

  const handleSuivre = () => {
    if (!isLoggedIn) {
      alert("Veuillez vous connecter pour suivre son achat");
      router.push("/login");
      return;
    } else {
      router.push("/mes_achat");
    }
  };

  const handleValidation = async (prix_panier) => {
    if (!isLoggedIn) {
      alert("Veuillez vous connecter pour valider le panier");
      router.push("/login");
      return;
    }
    try {
      const sessionId = Cookies.get("session_id");
      const response = await fetch(`${API_BASE_URL}/api/cart/valider-panier`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prix: prix_panier }),
      });
      if (!response.ok) throw new Error("Erreur validation panier");
      mutate(url);
    } catch {
      throw new Error("Erreur lors du chargement des commandes");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#006294] border-b-4"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Votre panier</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Produits */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-4 space-y-6">
          {!dataOfOrders?.data?.length ? (
            <div className="text-center py-20 text-gray-500 text-base sm:text-lg">
              <p>Aucun produit dans votre panier.</p>
            </div>
          ) : (
            dataOfOrders.data.map((order) => {
              const product = order.product;
              const isLoading = loadingItems[order.id_orderProduct] || false;
              return (
                <div key={order.id_orderProduct} className="flex flex-col md:flex-row gap-4 border-b pb-4">
                  <div className="w-28 h-28 flex-shrink-0">
                    <img
                      src={product.image?.url_image}
                      alt={product.name_product}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h2 className="text-lg sm:text-xl font-semibold">{product.name_product}</h2>
                      <button
                        onClick={() => handleDelete(order.id_orderProduct)}
                        className="text-[#006294] hover:text-[#C09200]"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                   <p className="text-sm sm:text-base text-gray-500">
  {order.product.proprieter.find(p => p.name_proprieter === "Quantité")?.name_proprieter
    ?? order.product.proprieter[order.product.proprieter.length - 1]?.name_proprieter
    ?? "-"}:{" "}
  {order.product.proprieter.find(p => p.name_proprieter === "Quantité")?.options?.name_option
    ?? order.product.proprieter[order.product.proprieter.length - 1]?.options?.name_option
    ?? "-"}
</p>


                    <div className="mt-2">
                      <p className="font-medium text-gray-800">{order.prix_total} Dhs HT</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleEdit(order)} className="p-2 border rounded-lg hover:bg-gray-100">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleSubmit(order.id_orderProduct)}
                        className="p-2 border rounded-lg hover:bg-gray-100"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-[#006294] border-b-2"></div>
                        ) : (
                          <Copy size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => handleSave(order.id_orderProduct)}
                        className="p-2 border rounded-lg hover:bg-gray-100"
                      >
                        <Save size={18} />
                      </button>
                    </div>
                    <div className="mt-4">
                      <button
                        className="text-sm sm:text-base text-gray-600 hover:underline"
                        onClick={() =>
                          setShowDetails((prev) => ({
                            ...prev,
                            [order.id_orderProduct]: !prev[order.id_orderProduct],
                          }))
                        }
                      >
                        {showDetails[order.id_orderProduct] ? "Masquer les détails ▲" : "Détails ▼"}
                      </button>
                      {showDetails[order.id_orderProduct] && (
                        <ul className="mt-2 text-sm sm:text-base text-gray-600 space-y-1 pl-4 list-disc">
                          {product.proprieter.map((p) => (
                            <li key={p.id_proprieter}>
                              <span className="font-medium">{p.name_proprieter}:</span> {p.options.name_option}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Résumé */}
        <div className="bg-white rounded-2xl shadow p-4 h-fit">
          <div className="space-y-2 border-b pb-3">
            <div className="flex justify-between">
              <span className="text-gray-600 text-base sm:text-lg">Total H.T</span>
              <span className="font-semibold text-base sm:text-lg">{
             dataOfOrders.data
      .reduce((sum, o) => sum + Number(o.prix_total || 0), 0)
      .toFixed(2)
                } Dhs</span>
            </div>
            <div className="flex justify-between text-lg sm:text-xl font-bold text-[#6071e5]">
              <span>Total TTC</span>
              <span>{
  dataOfOrders.data
      .reduce((sum, o) => sum + Number(o.prix_total || 0), 0)
      .toFixed(2)
              } Dhs</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={() => handleValidation(dataOfOrders.data
      .reduce((sum, o) => sum + Number(o.prix_total || 0), 0)
      .toFixed(2))}
              className="w-full bg-[#006294] hover:bg-[#C09200] text-white py-2 rounded-lg font-semibold text-base sm:text-lg"
              disabled={!dataOfOrders?.data?.length}
            >
              Valider mon panier
            </button>
            <button
              onClick={() => handleSuivre()}
              className="w-full border py-2 rounded-lg bg-[#006294] hover:bg-[#C09200] text-white font-semibold text-base sm:text-lg"
            >
              Poursuivre mes achats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
