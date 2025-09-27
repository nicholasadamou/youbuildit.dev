export interface ClientChallenge {
  slug: string;
  title: string;
  summary: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  skills: string[];
  estimatedTime: string;
  tier: 'free' | 'pro' | 'FREE' | 'PRO';
  hasAccess: boolean;
  premium?: boolean; // Legacy support
}
