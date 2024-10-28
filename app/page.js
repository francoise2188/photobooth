'use client';

import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function getDesign() {
      const { data, error } = await supabase
        .from('design_settings')
        .select('url')
        .eq('type', 'landing')
        .single();

      if (data?.url) {
        setBackgroundImage(data.url);
      }
    }

    getDesign();
  }, []);

  const handleStart = (e) => {
    e.preventDefault();
    if (email) {
      // Store email in localStorage
      localStorage.setItem('userEmail', email);
      // Navigate to camera page
      router.push('/camera');
    }
  };

  return (
    <main 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'contain', // Changed from 'cover' to 'contain'
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f3f4f6' // Added background color
      }}
    >
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg z-10">
        <h1 className="text-4xl font-bold mb-6">Photo Booth</h1>
        
        <form onSubmit={handleStart} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your email to start
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="block bg-blue-500 text-white px-8 py-3 rounded-lg text-center hover:bg-blue-600 transition"
          >
            Start
          </button>
        </form>
      </div>
    </main>
  );
}
