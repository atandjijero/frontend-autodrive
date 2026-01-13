"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const slides = [
    {
      title: "Location Flexible",
      description: "Réservez votre véhicule en quelques clics pour vos déplacements professionnels ou personnels.",
      icon: "🚗"
    },
    {
      title: "Assurance Complète Incluse",
      description: "Conduisez l'esprit tranquille avec notre assurance tous risques et assistance 24/7.",
      icon: "🛡️"
    },
    {
      title: "GPS Intégré Gratuit",
      description: "Naviguez facilement dans toutes vos destinations avec notre système GPS illimité.",
      icon: "🗺️"
    },
    {
      title: "Véhicules Révisés et Nettoyés",
      description: "Tous nos véhicules sont régulièrement entretenus et nettoyés pour votre confort et sécurité.",
      icon: "🔧"
    },
    {
      title: "Tarifs Compétitifs",
      description: "Profitez de nos meilleurs prix sur le marché de la location de véhicules.",
      icon: "💰"
    }
  ];

  return (
    <div className="relative">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="p-2">
                <Card className="bg-gray-100 dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="flex flex-col md:flex-row items-center justify-between p-12 h-64">
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl">{slide.icon}</span>
                        <h3 className="text-2xl font-bold text-foreground">{slide.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-lg leading-relaxed">{slide.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Boutons centrés au milieu */}
        <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
          <CarouselPrevious className="relative left-4 pointer-events-auto bg-white/80 hover:bg-white shadow-lg border-0" />
          <CarouselNext className="relative right-4 pointer-events-auto bg-white/80 hover:bg-white shadow-lg border-0" />
        </div>
      </Carousel>
    </div>
  );
}
