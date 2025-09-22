'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CustomProfile from '@/components/profile/CustomProfile';
import { SubscriptionManager } from '@/components/SubscriptionManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, CreditCard } from 'lucide-react';
import Footer from '@/components/sections/Footer';

function AccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('profile');

  // Set active tab from URL parameter on mount and when URL changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && (tabParam === 'profile' || tabParam === 'subscription')) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Handle tab change and update URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background to-muted/30">
        <div className="absolute inset-0 bg-gradient-to-r from-[#37d388]/5 to-[#37d388]/10 dark:from-[#37d388]/10 dark:to-[#37d388]/5" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,hsl(var(--muted))_50%,transparent_75%)] opacity-30 bg-[length:20px_20px]" />

        <div className="relative">
          <div className="container mx-auto py-12 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#37d388]/10 rounded-full text-sm font-medium text-[#37d388] border border-[#37d388]/20">
                  <User className="h-4 w-4" />
                  Account Management
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                  Account Settings
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Manage your profile, subscription, and security preferences in
                  one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-muted/30">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-5xl mx-auto">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <div className="flex justify-center mb-6 relative z-10">
                <TabsList className="inline-flex bg-card border border-border shadow-sm rounded-lg p-1">
                  <TabsTrigger
                    value="profile"
                    className="flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-[#37d388] data-[state=active]:text-white data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="subscription"
                    className="flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-[#37d388] data-[state=active]:text-white data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground"
                  >
                    <CreditCard className="h-4 w-4" />
                    Subscription
                  </TabsTrigger>
                </TabsList>
              </div>

              <div>
                <TabsContent value="profile" className="space-y-6">
                  <CustomProfile />
                </TabsContent>

                <TabsContent value="subscription">
                  <SubscriptionManager showHeader={false} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Footer - always at bottom */}
      <Footer />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-[#37d388]/20 border-t-[#37d388] rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading account...</p>
          </div>
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
