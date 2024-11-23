import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

export async function scrapePage(url: string) {
  try {
    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract common product information
    const data = {
      title: extractTitle($),
      price: extractPrice($),
      description: extractDescription($),
      images: extractImages($, url),
      shippingInfo: extractShippingInfo($),
      contactInfo: extractContactInfo($),
      domainAge: await getDomainAge(url),
      socialProof: extractSocialProof($),
      paymentMethods: extractPaymentMethods($)
    };

    return data;
  } catch (error) {
    console.error('Error scraping page:', error);
    throw error;
  }
}

function extractTitle($: cheerio.CheerioAPI): string {
  // Try multiple selectors for title
  const titleSelectors = [
    'h1',
    '[class*="product-title"]',
    '[class*="product-name"]',
    'meta[property="og:title"]',
    'title'
  ];

  for (const selector of titleSelectors) {
    const title = $(selector).first().text().trim() || $(selector).attr('content');
    if (title) return title;
  }

  return '';
}

function extractPrice($: cheerio.CheerioAPI): string {
  const priceSelectors = [
    '[class*="price"]:not([class*="from"]):not([class*="regular"]):not([class*="old"])',
    '[id*="price"]',
    'meta[property="product:price:amount"]',
    'meta[property="og:price:amount"]',
    '[class*="current-price"]',
    '[class*="sale-price"]'
  ];

  for (const selector of priceSelectors) {
    const price = $(selector).first().text().trim() || $(selector).attr('content');
    if (price) {
      // Clean up price string
      const cleanPrice = price.replace(/[^\d.,]/g, '');
      if (cleanPrice) return price;
    }
  }

  return '';
}

function extractDescription($: cheerio.CheerioAPI): string {
  const descriptionSelectors = [
    '[class*="description"]',
    '[id*="description"]',
    'meta[name="description"]',
    'meta[property="og:description"]',
    '[class*="product-description"]'
  ];

  for (const selector of descriptionSelectors) {
    const description = $(selector).first().text().trim() || $(selector).attr('content');
    if (description) return description;
  }

  return '';
}

function extractImages($: cheerio.CheerioAPI, baseUrl: string): string[] {
  const images: string[] = [];
  
  // Product image selectors
  const imageSelectors = [
    'meta[property="og:image"]',
    'meta[property="product:image"]',
    '[class*="product-image"] img',
    '[id*="product-image"] img',
    '[class*="gallery"] img',
    '[class*="slider"] img'
  ];

  for (const selector of imageSelectors) {
    $(selector).each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('content') || $(el).attr('data-src');
      if (src) {
        try {
          const absoluteUrl = new URL(src, baseUrl).href;
          if (!images.includes(absoluteUrl)) {
            images.push(absoluteUrl);
          }
        } catch (e) {
          console.error('Error processing image URL:', e);
        }
      }
    });
  }

  return images;
}

function extractShippingInfo($: cheerio.CheerioAPI): string {
  const shippingSelectors = [
    '[class*="shipping"]',
    '[class*="delivery"]',
    '[id*="shipping"]',
    '[id*="delivery"]'
  ];

  const shippingInfo: string[] = [];

  for (const selector of shippingSelectors) {
    $(selector).each((_, el) => {
      const info = $(el).text().trim();
      if (info && !shippingInfo.includes(info)) {
        shippingInfo.push(info);
      }
    });
  }

  return shippingInfo.join(' | ');
}

function extractContactInfo($: cheerio.CheerioAPI): string {
  const contactSelectors = [
    '[class*="contact"]',
    '[id*="contact"]',
    'a[href^="mailto:"]',
    'a[href^="tel:"]',
    '[class*="address"]'
  ];

  const contactInfo: string[] = [];

  for (const selector of contactSelectors) {
    $(selector).each((_, el) => {
      const info = $(el).text().trim();
      if (info && !contactInfo.includes(info)) {
        contactInfo.push(info);
      }
    });
  }

  return contactInfo.join(' | ');
}

async function getDomainAge(url: string): Promise<number> {
  try {
    const domain = new URL(url).hostname;
    // For now, return a default value since we can't make WHOIS requests
    // In production, you'd want to use a WHOIS API service
    return 180;
  } catch (error) {
    console.error('Error getting domain age:', error);
    return 0;
  }
}

function extractSocialProof($: cheerio.CheerioAPI): string[] {
  const proofSelectors = [
    '[class*="review"]',
    '[class*="rating"]',
    '[class*="testimonial"]',
    '[class*="stars"]'
  ];

  const proofs: string[] = [];

  for (const selector of proofSelectors) {
    $(selector).each((_, el) => {
      const proof = $(el).text().trim();
      if (proof && !proofs.includes(proof)) {
        proofs.push(proof);
      }
    });
  }

  return proofs;
}

function extractPaymentMethods($: cheerio.CheerioAPI): string[] {
  const methodSelectors = [
    '[class*="payment"] img',
    '[id*="payment"] img',
    '[class*="payment-methods"] img'
  ];

  const methods: string[] = [];

  for (const selector of methodSelectors) {
    $(selector).each((_, el) => {
      const alt = $(el).attr('alt');
      const title = $(el).attr('title');
      if (alt && !methods.includes(alt)) {
        methods.push(alt);
      } else if (title && !methods.includes(title)) {
        methods.push(title);
      }
    });
  }

  return methods;
}