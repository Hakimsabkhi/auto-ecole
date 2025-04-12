"use client"
import Link from 'next/link';
import React, { useState } from 'react';

// Define the interface for the form data
interface FormData {
  name: string;
  price: number;
  life: number;
}

const SubscriptionForm = () => {
  // Initialize the form data state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: 0,
    life: 0,
  });

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // You can now use formData to handle submission (e.g., send it to a server)
    try {
      const response = await fetch('/api/admin/subscription/postsubscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Handle response
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

    
      console.log('Server response:', 'ok');
      setFormData({
        name: '',
        price: 0,
        life: 0,
      });
     

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className=" mx-auto p-6 bg-white ">
      <h1 className="text-2xl font-semibold mb-6 text-center">Subscription</h1>
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
            Price :
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
            Life Day :
          </label>
          <input
            type="number"
            id="life"
            name="life"
            value={formData.life}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
        </div>
        <div className='flex flex-col gap-2 '>
        <button
          type="submit"
          className="w-full py-2 bg-gray-700 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Submit
        </button>
        <Link
          href={'/admin/subscription/'}
          className="w-full flex items-center justify-center py-2 pt-4 bg-gray-400 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </Link>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionForm;
