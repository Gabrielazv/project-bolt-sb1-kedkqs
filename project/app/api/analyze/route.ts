import { NextResponse } from 'next/server';
import { gemini } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { validateUrl } from '@/lib/validators';
import fetch from 'node-fetch';

async function getWebsiteContent(url: string) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Error fetching website:', error);
    throw new Error('Failed to fetch website content');
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    console.log('Analyzing URL:', url);

    if (!validateUrl(url)) {
      return NextResponse.json(
        { error: 'URL invalide' },
        { status: 400 }
      );
    }

    // Get the website content
    const websiteContent = await getWebsiteContent(url);
    console.log('Website content fetched, length:', websiteContent.length);

    // Prepare prompt for Gemini AI
    const prompt = `Analyze this e-commerce website for dropshipping indicators. The website content is from ${url}.
    
Your task is to determine if this is likely a dropshipping website by analyzing:
1. Marketing language and tactics
2. Pricing patterns
3. Shipping information
4. Product descriptions
5. Website professionalism
6. Contact information
7. Return policy
8. Trust indicators

Website Content:
${websiteContent.substring(0, 10000)}

Respond in French with a detailed JSON analysis:
{
  "isDropshipping": boolean,
  "confidence": number (0-1),
  "interpretation": string (detailed explanation of your reasoning),
  "reasons": string[] (list of specific indicators found),
  "suggestedAction": string (advice for the consumer),
  "analysis": {
    "marketingAnalysis": string (analysis of marketing tactics),
    "pricingAnalysis": string (analysis of pricing strategy),
    "trustAnalysis": string (analysis of trust factors)
  }
}`;

    console.log('Sending prompt to Gemini...');
    const result = await gemini.generateContent(prompt);
    console.log('Received response from Gemini');
    
    const analysis = JSON.parse(result.response.text());
    console.log('Parsed analysis:', analysis);

    // Store in Supabase
    const { error: dbError } = await supabase
      .from('analyses')
      .insert([{
        url,
        is_dropshipping: analysis.isDropshipping,
        confidence: analysis.confidence,
        interpretation: analysis.interpretation,
        reasons: analysis.reasons,
        analysis: analysis.analysis,
        timestamp: new Date().toISOString()
      }]);

    if (dbError) {
      console.error('Error saving to database:', dbError);
    }

    return NextResponse.json({
      isDropshipping: analysis.isDropshipping,
      confidence: analysis.confidence,
      message: analysis.isDropshipping
        ? "Ce site présente de forts indicateurs de dropshipping. Les prix semblent être significativement gonflés."
        : "Ce site semble légitime. Nous n'avons pas détecté d'indicateurs significatifs de dropshipping.",
      interpretation: analysis.interpretation,
      reasons: analysis.reasons,
      suggestedAction: analysis.suggestedAction,
      analysis: analysis.analysis
    });
  } catch (error) {
    console.error('Error analyzing website:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse du site' },
      { status: 500 }
    );
  }
}