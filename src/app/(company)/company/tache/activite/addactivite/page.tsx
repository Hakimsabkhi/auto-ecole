"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Page = () => {
  const route = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    prix: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    // Handle numeric fields like 'prix' to correctly parse values
    setFormData({
      ...formData,
      [name]: name === 'prix' ? parseFloat(value) : value,  // Only parse 'prix' as a number
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || formData.prix === 0) {
      alert('Please fill in all fields');
      return;
    }

    // Submit form data to the API or handle as needed
    try {
      const response = await fetch('/api/company/activity/type/posttype', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit activity form");
      }

      // Reset form data after successful submission
      setFormData({
        name: "",
        prix: 0,
      });

      // Redirect to the add activity page
      route.push('/company/tache/prix');
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="p-4 w-full bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-center mb-6">Activity </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name Activite
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="prix" className="block text-sm font-medium text-gray-700">
            Prix par heure
          </label>
          <input
            id="prix"
            name="prix"
            type="number"
            value={formData.prix}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className='grid grid-rows-1 gap-2'>
        <button
          type="submit"
          className="w-full bg-gray-900 hover:bg-gray-700 text-white py-2 rounded-md"
        >
          Generate Activite
        </button>
        <Link
          href={"/company/tache/activite/"}
          className=" bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md flex justify-center"
        >
          Retour
        </Link>
        </div>
      </form>
    </div>
  );
}

export default Page;
