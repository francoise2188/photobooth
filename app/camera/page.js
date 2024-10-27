'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CameraComponent from './CameraComponent';  // We'll create this next

export default function CameraPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get email from localStorage
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      // If no email, redirect back to start
      router.push('/');
      return;
    }
    setEmail(userEmail);
  }, [router]);

  if (!email) return null; // Don't render anything while checking email

  return <CameraComponent userEmail={email} />;
}
