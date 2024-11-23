"use client";

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const comparisons = [
  {
    product: "Montre connectée SmartFit X1",
    dropshipping: {
      price: "149,99 €",
      site: "smartfit-france.co",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    },
    original: {
      price: "19,99 €",
      site: "AliExpress",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    }
  },
  {
    product: "Projecteur Galaxy Light",
    dropshipping: {
      price: "89,99 €",
      site: "galaxy-projector.fr",
      image: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45"
    },
    original: {
      price: "12,99 €",
      site: "Wish",
      image: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45"
    }
  },
  {
    product: "Brosse lissante Pro+",
    dropshipping: {
      price: "129,99 €",
      site: "beauty-tools-fr.com",
      image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da"
    },
    original: {
      price: "15,99 €",
      site: "AliExpress",
      image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da"
    }
  }
];

export default function PriceComparisonSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            La réalité des prix
          </h2>
          <p className="text-lg text-gray-600">
            Découvrez comment les dropshippers gonflent les prix des produits que vous pouvez trouver ailleurs bien moins cher.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {comparisons.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-4 text-center">
                  {item.product}
                </h3>
                
                {/* Dropshipping Version */}
                <div className="mb-6">
                  <div className="relative w-full h-48 mb-3">
                    <Image
                      src={item.dropshipping.image}
                      alt={item.product}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Dropshipping
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-red-600 font-bold text-xl mb-1">{item.dropshipping.price}</p>
                    <p className="text-sm text-gray-500">{item.dropshipping.site}</p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center items-center my-4">
                  <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
                </div>

                {/* Original Version */}
                <div>
                  <div className="relative w-full h-48 mb-3">
                    <Image
                      src={item.original.image}
                      alt={item.product}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Original
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-green-600 font-bold text-xl mb-1">{item.original.price}</p>
                    <p className="text-sm text-gray-500">{item.original.site}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}