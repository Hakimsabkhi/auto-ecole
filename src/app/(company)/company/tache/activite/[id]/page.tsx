"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const route = useRouter();
   const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } >();
  const [formData, setFormData] = useState({
    name: "",
    prix: 0,
  });


     useEffect(() => {
    
        const fetchParams = async () => {
          try {
            const unwrapped = await params; 
  
            setUnwrappedParams(unwrapped);
          } catch (error) {
            console.error("Error unwrapping params:", error);
          }
        };
    
        fetchParams();
      }, [params]);


       useEffect(() => {
          
          
          if (unwrappedParams?.id) {
          
       const fetchActivity= async () => {
          try {
            const response = await fetch(`/api/company/task/activite/getactivite/${unwrappedParams?.id}`);
        
              if (!response.ok) {
                throw new Error("Failed to fetch workers");
              }
        
              const {existingatype} = await response.json(); // Update state with fetched data
        
              setFormData({
                name:existingatype.name,
                prix:existingatype.prix
              });
             
          } catch (err: unknown) {
            if (err instanceof Error) {
              console.error(err.message);
            } else {
              console.error("An unknown error occurred");
            }
          }
        }
        
          fetchActivity();
      }
        }, [unwrappedParams]);



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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

   

    // Submit form data to the API or handle as needed
    try {
      const response = await fetch(`/api/company/task/activite/updateactivite/${unwrappedParams?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit activit form");
      }

      // Reset form data after successful submission
      setFormData({
        name: "",
        prix: 0,
      });

      // Redirect to the add activity page
      route.push('/company/tache/activite');
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="p-4 w-full bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-center mb-6">Activity  Update</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Activite
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
          Update Activite
        </button>
        <Link
         href={"/company/tache/activite/"}
          className="w-full bg-gray-900 hover:bg-gray-700 text-white py-2 rounded-md flex justify-center"
        >
          Retour
        </Link>
        </div>
      </form>
    </div>
  );
}

export default Page;
