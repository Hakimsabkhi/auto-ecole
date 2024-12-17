"use client"; // Ensure the component is client-side if using Next.js 13+ with the App Router

import { ClientSafeProvider, getProviders, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SignInPage = () => {
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { data: session, status } = useSession(); // Track loading status of the session

  // Fetch providers once the component is mounted
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await getProviders();
        if (res) {
          setProviders(res);
        } else {
          setError('Failed to load authentication providers.');
        }
      } catch (error) {
        console.error('Error fetching providers:', error);
        setError('An unexpected error occurred while loading providers. Please try again.');
      }
    };
    fetchProviders();
  }, []);

  // Navigate to home if session is already available
  useEffect(() => {
    if (session) {
      if (session.user.role === "Admin") {
        router.push('/admin');
      } else if (session.user.role === "Company") {
        router.push('/company');
      } else if (session.user.role === "Worker") {
        router.push('/worker');
      }
    }
  }, [session, router]);

  // Show the sign-in page only when session is loading or providers are fetched
  if (status === "loading" || providers === null) {
    return <div>Loading...</div>; // You can customize a loading screen or skeleton UI
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        username: credentials.username,
        password: credentials.password,
      });
  
      if (result?.ok) {
        router.push('/admin/dashboard');
      } else {
        setError('Failed to sign in. Please check your email and password and try again.');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative bg-gray-100">
      <div className="bg-black/60 opacity-80 absolute h-full w-full"></div>
      <div className="bg-white absolute p-8 rounded shadow-md w-full max-md:w-3/4 max-w-md">
        <h1 className="text-2xl max-md:text-xl text-center font-bold mb-6">Sign in to your account</h1>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={credentials.username}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="•••••••••"
              value={credentials.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex justify-end items-center max-md:text-xs mb-4">
            <h1 className="text-blue-600 font-bold"> Forgot password?</h1>
          </div>
          <div className="flex flex-col gap-2 items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded-lg focus:outline-none focus:shadow-outline"
            >
              Sign In to your account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
