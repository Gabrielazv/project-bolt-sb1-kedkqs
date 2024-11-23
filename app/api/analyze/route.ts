import { NextResponse } from "next/server";
import { gemini } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import { validateUrl } from "@/lib/validators";
import fetch from "node-fetch";

async function getWebsiteContent(url: string) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error fetching website:", error);
    throw new Error("Failed to fetch website content");
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    console.log("Analyzing URL:", url);

    if (!validateUrl(url)) {
      return NextResponse.json({ error: "URL invalide" }, { status: 400 });
    }

    // Get the website content
    const websiteContent = await getWebsiteContent(url);
    console.log("Website content fetched, length:", websiteContent.length);

    // Prepare prompt for Gemini AI
    const prompt = `Analyze this e-commerce website for dropshipping indicators. The website content is from ${url}.
    
Your task is to determine if this is likely a dropshipping website by analyzing:
Make sure to check first if the website is an ecommerce website and then if it's a known brand or established company, if so it's not dropshipping.
1. **Marketing Language and Tactics**: Look for exaggerated claims, phrases like "limited stock" or "exclusive deals," and overly generic product descriptions.  
2. **Pricing Patterns**: Identify if the prices seem excessively marked up compared to typical retail prices or if the same product is available cheaper elsewhere.  
3. **Shipping Information**: Check if the shipping times are unusually long (e.g., weeks instead of days) or if the website avoids providing precise delivery timelines.  
4. **Product Descriptions**: Look for overly generic, poorly written, or copy-pasted descriptions that may indicate the use of supplier-provided content.  
5. **Website Professionalism**: Evaluate the site's design, grammar, spelling, and overall professionalism. Low-effort websites are more likely to be dropshipping.  
6. **Contact Information**: Determine if the site provides vague, hard-to-reach, or non-existent contact details (e.g., no phone number or email).  
7. **Return Policy**: Assess if the return policy is vague, inflexible, or places undue responsibility on the buyer.  
8. **Trust Indicators**: Verify if the site includes valid trust badges, verified reviews, or social proof. Invalid or fake trust signals can indicate dropshipping.
Please take also into account when we are dealing with well known brands, websites and established players that are very unlikely to be amateur dropshippers naturally.
Website Content:
${websiteContent.substring(0, 10000)}

Please respond with a valid JSON object without any Markdown formatting:
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

    console.log("Sending prompt to Gemini...");
    const result = await gemini.generateContent(prompt);
    console.log("Received response from Gemini");

    // Log the raw response for debugging
    const rawResponse = result.response.text();
    console.log("Raw response from Gemini:", rawResponse);

    // Clean the response and parse it
    const jsonResponse = rawResponse
      .replace(/```json|```/g, "") // Remove Markdown code block indicators
      .trim(); // Trim whitespace

    let analysis; // Declare the analysis variable
    try {
      analysis = JSON.parse(jsonResponse); // Parse the cleaned response
      console.log("Parsed analysis:", analysis);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return NextResponse.json(
        { error: "Invalid JSON response from Gemini" },
        { status: 500 }
      );
    }

    // Store in Supabase
    const { error: dbError } = await supabase.from("analyses").insert([
      {
        url,
        is_dropshipping: analysis.isDropshipping,
        confidence: analysis.confidence,
        interpretation: analysis.interpretation,
        reasons: analysis.reasons,
        analysis: analysis.analysis,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (dbError) {
      console.error("Error saving to database:", dbError);
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
      analysis: analysis.analysis,
    });
  } catch (error) {
    console.error("Error analyzing website:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse du site" },
      { status: 500 }
    );
  }
}
