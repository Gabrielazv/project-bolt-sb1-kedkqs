"use client";

import Image from 'next/image';
import { AlertCircle, AlertTriangle } from 'lucide-react';

const testimonials = [
  {
    name: "Marie L.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    quote: "Cette montre connectée a changé ma vie ! Je ne peux plus m'en passer, c'est LA révolution tech de l'année 🔥",
    reality: "Un dropshipper peut payer 2€ pour ce faux témoignage sur n'importe quelle plateforme de micro-services. ",
    
  },
  {
    name: "Thomas D.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    quote: "Le meilleur rapport qualité-prix du marché ! J'ai testé des centaines de produits, celui-ci est exceptionnel ⭐⭐⭐⭐⭐",
    reality: "Cet avis est complètement fictif, et ajouté à la main. Cette peronne n'existe même pas.",
    
  },
  {
    name: "Sophie M.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    quote: "Livraison ultra rapide en 3 jours ! Le service client est top, je recommande vivement 👌",
    reality: "Délai réel : 3-4 semaines depuis la Chine. Parfois ces commentaires peuvent provenir d'autres sites permettant de jouer sur les mots et affirmer qu'ils sont réels",

  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Attention aux faux témoignages !
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Les dropshippers utilisent souvent des témoignages fictifs pour vous manipuler.
            Survolez les exemples ci-dessous pour voir la réalité derrière le marketing.
          </p>
          <div className="inline-block bg-yellow-100 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Le saviez-vous ?</strong> 90% des témoignages sur les sites de dropshipping sont fabriqués de toutes pièces.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 group relative"
            >
              {/* Fake testimonial side */}
              <div className="relative z-10 transition-opacity duration-300 group-hover:opacity-0">
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 italic">{testimonial.quote}</p>
                </div>
              </div>

              {/* Reality overlay */}
              <div className="absolute inset-0 bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <h4 className="font-bold text-red-600 mb-2 text-center">La réalité :</h4>
                <div className="space-y-3">
                  <p className="text-red-800 text-sm border-b border-red-200 pb-2">{testimonial.reality}</p>
                  <p className="text-red-800 text-sm font-semibold">{testimonial.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}