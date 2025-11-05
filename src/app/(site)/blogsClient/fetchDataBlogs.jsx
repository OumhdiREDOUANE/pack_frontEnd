"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function BlogPage({ regularPosts }) {
  const [expandedArticles, setExpandedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (regularPosts && regularPosts.length > 0) {
      setBlogs(regularPosts);
    }
    setLoading(false);
  }, [regularPosts]);

  const toggleArticle = (articleId) => {
    setExpandedArticles((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 font-sans">
        <Skeleton height={40} width={200} className="mb-6" />
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden bg-card border-border">
              <Skeleton height={180} />
              <CardHeader>
                <Skeleton height={20} width={80} />
                <Skeleton height={25} width={`80%`} className="mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton height={60} count={2} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-sans">
        Aucune donnée disponible pour le moment.
      </div>
    );
  }

  const [featuredPost, ...normalPosts] = blogs;

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Featured Post */}
      {featuredPost && (
        <section className="container mx-auto px-4 py-8">
          <div className="relative overflow-hidden rounded-lg bg-card border-border">
            <div className="relative h-96 md:h-[500px]">
              <img
                src={featuredPost.image_blog || "/placeholder.svg"}
                alt={featuredPost.title}
                className="object-cover w-full h-full transition-opacity duration-500 opacity-0"
                onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-8">
                  <div className="max-w-2xl text-white">
                    <Badge className="mb-4 bg-[#006294] hover:bg-[#C09200] text-white font-medium text-sm">
                      {featuredPost.category}
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance leading-tight">
                      {featuredPost.title}
                    </h1>
                    <p className="text-base sm:text-lg leading-relaxed mb-6 text-white/90">
                      {expandedArticles.includes(featuredPost.id)
                        ? featuredPost.content
                        : featuredPost.excerpt}
                    </p>
                    <Button
                      onClick={() => toggleArticle(featuredPost.id)}
                      className="bg-[#006294] hover:bg-[#C09200] text-white font-medium text-base sm:text-lg"
                    >
                      {expandedArticles.includes(featuredPost.id)
                        ? "Réduire ←"
                        : "Lire plus →"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {normalPosts.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden bg-card border-border hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video relative">
                <img
                  src={post.image_blog || "/placeholder.svg"}
                  alt={post.title}
                  className="object-cover w-full h-full transition-opacity duration-500 opacity-0"
                  onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs font-medium">
                    {post.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {post.author}
                  </span>
                </div>
                <CardTitle className="text-xl text-card-foreground text-balance font-semibold leading-tight">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-500 leading-relaxed mb-4 text-base sm:text-lg">
                  {expandedArticles.includes(post.id) ? post.content : post.excerpt}
                </CardDescription>
                <Button
                  onClick={() => toggleArticle(post.id)}
                  variant="outline"
                  className="bg-[#006294] hover:bg-[#C09200] text-white font-medium text-base sm:text-lg"
                >
                  {expandedArticles.includes(post.id) ? "Réduire ←" : "Lire plus →"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
