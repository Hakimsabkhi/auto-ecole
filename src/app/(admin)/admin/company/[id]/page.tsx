'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

// Define types for form data and subscription options
interface FormData {
  companyName: string;
  username: string;
  phone: string;
  password: string;
  subscription: string;
}


const UpdateComapny =({ params }: { params: Promise<{ id: string }> })  => {
     const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  // Initialize state with the defined interface
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    username: '',
    phone: '',
    password: '',
    subscription: '',
  });
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
  useEffect(() => {
    if (unwrappedParams?.id) {
      const fetchCompany = async () => {
        try {
          const response = await fetch(`/api/admin/company/getcompanybyid/${unwrappedParams.id}`);
          const {existingCompany} = await response.json();
          
          setFormData({
            companyName: existingCompany.name,
    username: existingCompany.username,
    phone: existingCompany.phone,
    password: '',
    subscription:existingCompany.subscription,
          });
        } catch (error) {
          console.error('Error fetching company data:', error);
        }
      };

      fetchCompany();
    }
  }, [unwrappedParams?.id]);
  
 
  const route=useRouter();


  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/admin/company/updatecompany/${unwrappedParams?.id}`, {  // Replace with your API endpoint
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to create company');
      }
      // Handle success (you can redirect or show a success message here)
     
      // Optionally, reset form after submit
      setFormData({
        companyName: '',
        username: '',
        phone: '',
        password: '',
        subscription: '',
      }); 
      route.push('/admin/company')
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };



  return (
    <div className="mx-auto p-6 bg-white uppercase">
      <h2 className="text-2xl font-semibold mb-6 text-center ">Update Company</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded w-full"
            placeholder="Enter company name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            className="mt-2 p-3 border border-gray-300 rounded w-full"
            placeholder="Choose a username"
            disabled
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded w-full"
            placeholder="Enter phone number"
            pattern="\d*"  // This restricts input to numbers only
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded w-full"
            placeholder="Enter password"
          />
        </div>

        <div className="mt-6 text-center flex gap-2">
          <Link href="/admin/company" className='w-full py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-400 transition duration-200'>
            Cancel
          </Link>
          <button
            type="submit"
            className="w-full py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateComapny;
