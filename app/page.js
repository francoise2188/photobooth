'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userEmail', email);
    router.push('/camera');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Virtual Photo Booth
        </h1>
        
        <p className="text-center text-gray-600 mb-8">
          Enter your email to start capturing memories!
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg font-semibold hover:opacity-90 transform transition-all hover:-translate-y-1"
          >
            Start Photo Booth →
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Your email will be used to send your photos
        </p>
      </div>
    </main>
  );
}
