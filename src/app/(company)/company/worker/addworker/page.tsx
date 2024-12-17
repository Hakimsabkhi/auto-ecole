"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Page = () => {
    const route=useRouter()
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., send the data to an API
   
    try {
        const response = await fetch('/api/company/worker/postworker', {  // Replace with your API endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Failed to create worker');
        }
        // Handle success (you can redirect or show a success message here)
       
        // Optionally, reset form after submit
        setFormData({
            name: '',
            username: '',
            phone: '',
            password: ''
        }); 
        route.push('/company/worker')
      } catch (error) {
        console.error('Error creating worker:', error);
      }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full ">
      <h2 className="text-2xl font-semibold text-center mb-4">Worker Information</h2>
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone:</label>
  <input 
    type="number" 
    id="phone" 
    name="phone" 
    value={formData.phone} 
    onChange={handleChange} 
    required 
    minLength={8}
    maxLength={8}
    pattern="^\d{8}$"  
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
  />
</div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mt-6 text-center flex gap-2">
          <Link href="/company/worker" className='w-full py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-400 transition duration-200'>
            Cancel
          </Link>
          <button
            type="submit"
            className="w-full py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
