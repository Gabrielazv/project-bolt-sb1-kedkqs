"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Shield, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Analysis {
  marketingAnalysis: string;
  pricingAnalysis: string;
  trustAnalysis: string;
}

interface AnalysisResult {
  isDropshipping: boolean;
  confidence: number;
  message: string;
  interpretation: string;
  reasons: string[];
  suggestedAction: string;
  analysis: Analysis;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const analyzeProduct = async () => {
      const url = searchParams.get('url');
      
      if (!url) {
        setError('URL non fournie');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();
        setResult(data);
      } catch (err) {
        console.error('Analysis error:', err);
        setError('Erreur lors de l\'analyse du produit. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    };

    analyzeProduct();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Analyse en cours...</h2>
          <p className="text-gray-600 mt-2">Nous analysons le site web. Merci de patienter.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="text-center mt-4">
            <Link href="/">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Link href="/">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {result.isDropshipping ? (
            <div className="text-center mb-12">
              <div className="inline-block p-4 bg-red-100 rounded-full mb-6">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                ⚠️ Attention : Site de Dropshipping Détecté !
              </h1>
              <p className="text-xl text-gray-600 mb-6">{result.message}</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="font-semibold text-red-800">
                  Niveau de confiance : {Math.round(result.confidence * 100)}%
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center mb-12">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
                <Shield className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                ✅ Site Fiable Confirmé !
              </h1>
              <p className="text-xl text-gray-600 mb-6">{result.message}</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="font-semibold text-green-800">
                  Niveau de confiance : {Math.round(result.confidence * 100)}%
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Interprétation de l'analyse</h2>
            <p className="text-gray-700 mb-4">{result.interpretation}</p>
            
            <h3 className="font-semibold mt-6 mb-2">Indicateurs détectés :</h3>
            <ul className="list-disc pl-6 space-y-2">
              {result.reasons.map((reason, index) => (
                <li key={index} className="text-gray-700">{reason}</li>
              ))}
            </ul>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Action recommandée :</h3>
              <p className="text-blue-700">{result.suggestedAction}</p>
            </div>
          </div>

          <Accordion type="single" collapsible className="mb-8">
            <AccordionItem value="analysis">
              <AccordionTrigger>Voir l'analyse détaillée</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 p-4 bg-white rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Analyse du marketing</h3>
                    <p className="text-gray-600">{result.analysis.marketingAnalysis}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Analyse des prix</h3>
                    <p className="text-gray-600">{result.analysis.pricingAnalysis}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Analyse de la confiance</h3>
                    <p className="text-gray-600">{result.analysis.trustAnalysis}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="text-center mt-8">
            <Link href="/">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                Analyser un autre site
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}