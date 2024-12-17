"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define the interface for the form data
interface FormData {
  name: string;
  price: number;
  life: string;
}

export default function UpdateSubscription({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Unwrap the params using React.use() and set state
  useEffect(() => {
    const fetchParams = async () => {
      try {
        const unwrapped = await params; // Unwrap the Promise
        setUnwrappedParams(unwrapped); // Store unwrapped params
      } catch (error) {
        console.error("Error unwrapping params:", error);
      }
    };

    fetchParams();
  }, [params]);

  // Initialize form data state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: 0,
    life: '',
  });

  // Fetch subscription data when id is available
  useEffect(() => {
    if (unwrappedParams?.id) {
      const fetchSubscription = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/admin/subscription/subscriptionbyid/${unwrappedParams.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch subscription data');
          }
          const {existingSubscription} = await response.json();
          
          setFormData({
            name: existingSubscription.name,
            price: existingSubscription.price,
            life: existingSubscription.life,
          });
        } catch (error) {
          console.error('Error fetching subscription data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSubscription();
    }
  }, [unwrappedParams]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for updating the subscription
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!unwrappedParams?.id) return; // Ensure id is available for update

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/subscription/updatesubscription/${unwrappedParams.id}`, {
        method: 'PUT', // Use PUT to update the resource
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      // Optionally, redirect after successful submission
      console.log('Subscription updated successfully');
      router.push('/admin/subscription/'); // Redirect to the subscription list page after update
    } catch (error) {
      console.error('Error updating subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto p-6 bg-white">
      <h1 className="text-2xl font-semibold mb-6 text-center">
    Edit Subscription
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Name field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
        </div>

        {/* Price field */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price:
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
        </div>

        {/* Life field */}
        <div className="mb-4">
          <label htmlFor="life" className="block text-sm font-medium text-gray-700">
            Life Day:
          </label>
          <input
            type="text"
            id="life"
            name="life"
            value={formData.life}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className="w-full py-2 bg-gray-700 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
             Update
          </button>
          <Link
            href="/admin/subscription/"
            className="w-full flex items-center justify-center py-2 pt-4 bg-gray-400 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};
