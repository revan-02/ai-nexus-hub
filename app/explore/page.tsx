import { redirect } from 'next/navigation';

// /explore → redirect to the Roadmap (real learning rooms with working links)
export default function ExplorePage() {
  redirect('/roadmap');
}
