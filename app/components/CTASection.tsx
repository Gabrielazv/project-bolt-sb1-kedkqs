"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-teal-700 to-teal-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Prêt à démasquer les dropshippers ?
        </h2>
        <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
          Protégez-vous des arnaques et économisez votre argent. Vérifiez maintenant si votre produit est vendu au juste prix.
        </p>
        <Button 
          size="lg"
          className="rounded-full bg-yellow-500 text-gray-800 hover:bg-yellow-400 shadow-lg transition-all duration-300 transform hover:scale-105"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Vérifier un produit <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}