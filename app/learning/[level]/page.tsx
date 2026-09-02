'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useNexus, UserLevel } from '@/context/nexus-context';
import DashboardPage from '@/app/dashboard/page';

export default function LevelLearningPage() {
  const params = useParams();
  const level = params?.level as UserLevel;
  const { setUserLevel } = useNexus();

  useEffect(() => {
    if (level && ['beginner', 'intermediate', 'advanced', 'expert'].includes(level)) {
      setUserLevel(level);
    }
  }, [level, setUserLevel]);

  return <DashboardPage />;
}
