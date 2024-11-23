import { extractProductInfo } from './extractors';
import { analyzeSiteWithLLM } from './llmAnalyzer';
import { Product } from './types';

const DROPSHIPPING_CONFIDENCE_THRESHOLD = 0.7;

export async function analyzeSite(url: string): Promise<{
  isDropshipping: boolean;
  confidence: number;
  message: string;
  reasons: string[];
  product?: Product;
  suggestedPrice?: string;
}> {
  try {
    // Extract product information from the URL
    const product = await extractProductInfo(url);

    // Analyze the site using LLM
    const llmAnalysis = await analyzeSiteWithLLM(url, product);

    // Determine if it's dropshipping based on confidence threshold
    const isDropshipping = llmAnalysis.confidence >= DROPSHIPPING_CONFIDENCE_THRESHOLD;

    let message = isDropshipping
      ? "Ce site présente de forts indicateurs de dropshipping. Les prix semblent être significativement gonflés."
      : "Ce site semble légitime. Nous n'avons pas détecté d'indicateurs significatifs de dropshipping.";

    return {
      isDropshipping,
      confidence: llmAnalysis.confidence,
      message,
      reasons: llmAnalysis.reasons,
      product,
      suggestedPrice: llmAnalysis.suggestedPrice
    };
  } catch (error) {
    console.error('Error analyzing site:', error);
    throw new Error('Failed to analyze site');
  }
}