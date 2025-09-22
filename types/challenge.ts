export interface ClientChallenge {
  slug: string;
  title: string;
  summary: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  skills: string[];
  estimatedTime: string;
  tier: 'free' | 'pro' | 'team';
  hasAccess: boolean;
  premium?: boolean; // Legacy support
}
