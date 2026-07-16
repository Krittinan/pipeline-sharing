import { Suspense } from 'react';
import HomeFeed from '@/components/HomeFeed';

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeFeed />
    </Suspense>
  );
}
