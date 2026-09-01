import { WishVibe } from '@/types';
import { supabase } from '@/lib/supabase/client';

export interface AIGenerateParams {
  vibe: WishVibe;
  recipientName: string;
  relationship?: string;
  facts: {
    fact1: string;
    fact2: string;
    fact3: string;
    insideJoke?: string;
  };
}

export async function generateWishContent(params: AIGenerateParams): Promise<{ headline: string; body: string }> {
  const { vibe, recipientName, facts, relationship } = params;

  try {
    let token = '';
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      token = data.session?.access_token || '';
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        vibe: vibe,
        recipientName: recipientName,
        facts: [facts.fact1, facts.fact2, facts.fact3],
        insideJoke: facts.insideJoke || '',
      }),
    });

    if (res.ok) {
      const parsed = await res.json();
      return {
        headline: parsed.headline,
        body: parsed.body,
      };
    } else {
      console.warn('Backend AI generation failed, falling back to templates.');
    }
  } catch (err) {
    console.warn('AI API call failed, using intelligent template engine:', err);
  }

  // High-fidelity dynamic template matrix for ultra-fast instant generation & fallback
  return generateIntelligentFallback(params);
}

function generateIntelligentFallback(params: AIGenerateParams): { headline: string; body: string } {
  const { vibe, recipientName, facts } = params;
  const f1 = facts.fact1 || 'drinking iced coffee at midnight';
  const f2 = facts.fact2 || 'always being 15 minutes late';
  const f3 = facts.fact3 || 'having questionable taste in movies';
  const joke = facts.insideJoke || 'that unforgettable road trip disaster';

  switch (vibe) {
    case 'roast':
      return {
        headline: `⚠️ CRITICAL AGING ALERT FOR ${recipientName.toUpperCase()}`,
        body: `Happy Birthday ${recipientName}! The scientific community has reviewed the data: someone who is ${f1}, has a reputation for ${f2}, and still defends ${f3} should legally not be allowed to get any older. We all remember ${joke}, and we still haven't fully forgiven you. Have a great day, old timer!`,
      };

    case 'snarky':
      return {
        headline: `Another Year Older, ${recipientName}? Debatable.`,
        body: `Happy Birthday ${recipientName}! They say wisdom comes with age, but considering you're still ${f1} and notorious for ${f2}, I’m going to need peer-reviewed evidence. Still, nobody pulls off ${f3} quite like you. Raising a glass to the legend behind ${joke}!`,
      };

    case 'sentimental':
      return {
        headline: `To ${recipientName}: Celebrating the Rarest Light`,
        body: `Happy Birthday, ${recipientName}. Whether it’s your passion for ${f1}, the way you light up every room with ${f2}, or simply being the person who understands ${f3} — you make the world so much softer and brighter. Never forget ${joke} and how much you mean to everyone around you. Wishing you a year of pure happiness.`,
      };

    case 'custom':
      return {
        headline: `TOP SECRET DOSSIER: Happy Birthday ${recipientName}`,
        body: `Declassified at 00:00: Subject ${recipientName} has been identified as exceptionally awesome. Key surveillance notes: actively involved in ${f1}, master of ${f2}, and unmatched in ${f3}. Code word: "${joke}". Have a mysterious and unforgettable celebration.`,
      };

    case 'sweet':
    default:
      return {
        headline: `Happy Birthday to the One and Only ${recipientName}! ✨`,
        body: `Sending the biggest birthday cheers to ${recipientName}! May your day be filled with ${f1}, zero stress about ${f2}, and all the best moments like ${f3}. Here's to making even more chaotic memories like ${joke}. Have the best year yet!`,
      };
  }
}
