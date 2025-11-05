
import FAQPage from "./fetchDataFaq";

export default async function FetchDataFaqs() {
  
  let responseData = [];
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
  try {
    const res = await fetch(`${API_BASE_URL}/api/faqs`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("Failed to fetch blog data");

    responseData = await res.json();
    
  } catch (error) {
         throw new Error("Erreur lors du chargement des commandes");
    
  }

  return <FAQPage faqItems={responseData || []} />;
}
