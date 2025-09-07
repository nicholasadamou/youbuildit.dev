import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use | You Build It',
  description:
    'Terms of use and conditions for using the You Build It platform.',
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
