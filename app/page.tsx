"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Menu, ShoppingCart, Package, Shield, Search } from 'lucide-react';
import Image from 'next/image';
import CTASection from './components/CTASection';
import TestimonialsSection from './components/TestimonialsSection';
import PriceComparisonSection from './components/PriceComparisonSection';

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    const isDemoDropshipping = Math.random() < 0.5;
    const demoParam = isDemoDropshipping ? '&demo=dropshipping' : '&demo=legitimate';
    
    router.push(`/results?url=${encodeURIComponent(url)}${demoParam}`);
  };

  const dropshippingInfo = [
    {
      title: "Le rêve du dropshipping",
      content: "Tu viens d'avoir 18 ans et tu penses devenir le prochain Jeff Bezos en revendant des produits chinois 10 fois plus cher ? Attention, le dropshipping n'est pas la poule aux œufs d'or que tu crois !",
      icon: <ShoppingCart className="h-12 w-12 text-teal-600" />
    },
    {
      title: "La réalité cachée",
      content: "Derrière les promesses de richesse facile se cachent des clients mécontents, des marges qui fondent et des clients mécontents. Le dropshipping, c'est souvent plus de galère que de glamour !",
      icon: <Package className="h-12 w-12 text-teal-600" />
    },
    {
      title: "Notre mission",
      content: "On est là pour rétablir la vérité et protéger les consommateurs. Avec nous, découvre les vrais prix, les délais réels et évite de te faire avoir par des promesses trompeuses.",
      icon: <Shield className="h-12 w-12 text-teal-600" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-teal-700 to-teal-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <Shield className="h-8 w-8 text-teal-700" />
                  <div className="absolute -top-1 -right-1">
                    <Search className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-white to-yellow-300 text-transparent bg-clip-text">
                  Balance Ton Dropshippeur
                </div>
                <div className="text-sm text-yellow-300">Votre détective e-commerce</div>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="hover:text-yellow-300 transition-colors font-medium">Accueil</a>
              <a href="#" className="hover:text-yellow-300 transition-colors font-medium">À propos</a>
              <a href="#" className="hover:text-yellow-300 transition-colors font-medium">Contact</a>
            </nav>
            <Button 
              variant="outline" 
              className="md:hidden text-white border-white hover:bg-teal-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav className="md:hidden bg-teal-800 p-4">
            <div className="flex flex-col space-y-2">
              <a href="#" className="text-white hover:text-yellow-300 transition-colors font-medium">Accueil</a>
              <a href="#" className="text-white hover:text-yellow-300 transition-colors font-medium">À propos</a>
              <a href="#" className="text-white hover:text-yellow-300 transition-colors font-medium">Contact</a>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-grow">
        <section className="bg-gradient-to-b from-teal-600 to-teal-800 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-50"></div>
            <Image
              src="https://images.unsplash.com/photo-1512314889357-e157c22f938d"
              alt="Detective with magnifying glass"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Démasquez les Dropshippers</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">Ne vous faites plus avoir par des prix gonflés. Découvrez la vérité derrière chaque produit en un clic.</p>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <Input 
                  type="url" 
                  placeholder="Collez l'URL du produit ici" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-full text-gray-800 shadow-lg"
                  required
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="rounded-full bg-yellow-500 text-gray-800 hover:bg-yellow-400 shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Vérifier <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </section>

        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Comprendre le Dropshipping</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {dropshippingInfo.map((info, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-teal-100 rounded-full">
                    {info.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-teal-700">{info.title}</h3>
                  <p className="text-gray-600">{info.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PriceComparisonSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Balance Ton Dropshippeur. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}