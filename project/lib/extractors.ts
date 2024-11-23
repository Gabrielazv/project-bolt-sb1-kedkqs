import { Product } from './types';

export async function extractProductInfo(url: string): Promise<Product> {
  try {
    // For demo purposes, return mock data since we can't make real HTTP requests
    // in a static export environment
    return {
      name: 'Exemple de produit',
      price: '99,99 €',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      productUrl: url,
      merchant: new URL(url).hostname
    };
  } catch (error) {
    console.error('Error extracting product info:', error);
    throw new Error('Failed to extract product information');
  }
}