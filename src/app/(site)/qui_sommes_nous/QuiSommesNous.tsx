"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function QuiSommesNous() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#006294] px-6 py-20 text-white min-h-[70vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('/3d-paper-geometric-shapes.png')",
            transform: `translateY(${scrollY * -0.2}px) scale(1.1)`,
          }}
        />
        <div className="absolute inset-0 bg-[#006294]" />
        <div className="absolute inset-0 overflow-hidden">
          {/* أشكال هندسية تتحرك مع الماوس */}
        </div>

        <div className="container mx-auto max-w-6xl relative z-6">
          <div className="flex flex-col items-center justify-center text-center space-y-6 lg:space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-in slide-in-from-bottom duration-1000">
              <span className="inline-block animate-in slide-in-from-bottom duration-1000 delay-200">
                Imprimerie
              </span>
              <br />
              <span className="text-4xl sm:text-5xl lg:text-6xl font-bold animate-in slide-in-from-bottom duration-1000 delay-400">
                100% digitale
              </span>
            </h1>

            <p className="text-base sm:text-lg text-white/95 animate-in slide-in-from-bottom duration-1000 delay-600 max-w-2xl">
              Donnez vie à vos créations en un simple clic!
            </p>

            <div className="flex gap-2 justify-center animate-in slide-in-from-bottom duration-1000 delay-800">
              <div className="h-1 w-8 bg-white rounded-full"></div>
              <div className="h-1 w-8 bg-white/60 rounded-full"></div>
              <div className="h-1 w-16 bg-white rounded-full"></div>
              <div className="h-1 w-8 bg-white/60 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="px-6 py-4 text-sm text-muted-foreground">
        <div className="container mx-auto max-w-6xl font-sans">
          <span>Accueil</span>
          <span className="mx-2">-</span>
          <span className="text-foreground">Qui sommes-nous ?</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-6 py-12 font-sans">
        <div className="container mx-auto max-w-6xl space-y-16">
          {/* About Section */}
          <section className="text-center space-y-8">
            <h2 className="text-3xl text-[#006294] font-bold mb-10">
              Packspace est une imprimerie <span className="text-[#C09200]">100% digitale</span>
            </h2>

            <div className="max-w-4xl mx-auto space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                Fruit de l'expérience et de la modernité,{" "}
                <strong className="text-[#C09200]">
                  Packspace a réuni le meilleur de l'impression et du web.
                </strong>
              </p>
              <p>
                Nous bénéficions d'un savoir-faire unique de professionnels de la digitalisation, mais aussi de la
                chaîne graphique et de l'impression offset et numérique.
              </p>
              <p>
                Chez WePrint tout a été repensé pour en faire une imprimerie comme vous n'en avez jamais vu ! Nous
                sommes en effet équipés des dernières technologies en matière d'impression et d'automatisation de la
                production.
              </p>
            </div>
          </section>

          {/* Advantages Section */}
          <section className="space-y-12">
            <h3 className="text-3xl text-[#006294] font-bold text-center mb-10">
              Les avantages <span className="text-[#C09200]">Packspace</span>
            </h3>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-[#006294] hover:bg-[#C09200] text-white rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold">Rapidité</h4>
                  <p className="text-muted-foreground text-base">Production automatisée pour des délais ultra-rapides</p>
                </CardContent>
              </Card>

              {/* باقي البطاقات نفسها مع text-base أو text-lg للعناصر */}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center space-y-8 py-16">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm px-4 py-2 bg-[#006294] hover:bg-[#C09200] text-white">
                Prêt à commencer ?
              </Badge>
              <h3 className="text-3xl text-[#006294] font-bold mb-10">
                Découvrez nos services d'impression digitale
              </h3>
              <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
                Rejoignez des milliers de clients satisfaits qui font confiance à Packspace pour leurs projets d'impression.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/HomePage">
                <Button size="lg" className="text-lg px-8 py-6 bg-[#006294] hover:bg-[#C09200] text-white">
                  Voir nos produits
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
