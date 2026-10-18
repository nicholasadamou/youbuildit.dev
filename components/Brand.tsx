import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Brand() {
  return (
    <Link href="/" className="brand" aria-label="You Build It home">
      <Logo />
      <span>you build it</span>
    </Link>
  );
}
