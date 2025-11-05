
import BlogPage from "./fetchDataBlogs";

export default async function FetchDataBlogs() {
  
  let responseData = [];
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
 
    const res = await fetch(`${API_BASE_URL}/api/blogs`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("Failed to fetch blog data");

    responseData = await res.json();
    
  

  return <BlogPage regularPosts={responseData || []} />;
}
