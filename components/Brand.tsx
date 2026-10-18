import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Brand() {
  return (
    <Link href="/" className="brand" aria-label="You Build It home">
      <Logo />
      <span>
        you<span className="brand-sub"> / build it</span>
      </span>
    </Link>
  );
}
