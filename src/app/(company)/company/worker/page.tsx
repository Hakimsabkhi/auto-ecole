"use client"; // Ensure that it's client-side only if using Next.js 13+ with App Router
import PopupDelete from '@/components/popup/DeletePopup';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { CiEdit } from 'react-icons/ci';
import { RiDeleteBin5Line } from 'react-icons/ri';

// Define a type for the worker object
interface Worker {
  _id: string;
  name: string;
  username: string;
  phone: string;
  formateur:string;
}

const Page = () => {
  // State to store worker data and loading status
   const [isPopupOpen, setIsPopupOpen] = useState(false);
     const [selected, setSelected] = useState<Worker | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch workers from the API
  const fetchWorkers = async () => {
    try {
      const response = await fetch('/api/company/worker/getworkerbycompany');
      
      if (!response.ok) {
        throw new Error('Failed to fetch workers');
      }

      const data = await response.json();
      console.log(data)
      setWorkers(data);  // Update state with fetched data
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error('An unknown error occurred');
      }
    } finally {
      setLoading(false);  // Set loading state to false after fetching is complete
    }
  };

  // Fetch workers on initial render
  useEffect(() => {
    fetchWorkers();
  }, []);  
  const handleDeleteClick = (worker: Worker) => {
    setSelected(worker);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelected(null);
  };
  const deleteWorker = async (workerId: string) => {
    try {
      const response = await fetch(`/api/company/worker/deleteworker/${workerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete worker");
      }
      fetchWorkers();
      console.log('Deleted successfully');
    }  catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`Failed to delete worker: ${err.message}`);
      } else {
        console.error('Failed to delete worker: Unknown error');
      }
    } finally {
      handleClosePopup();
    }
  };

  // Show loading indicator while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Worker Table</h1>
      <div className="flex w-full justify-end pb-4">
        <Link href={'/company/worker/addworker'} className="bg-gray-800 p-4 rounded-md text-white">
          Create Worker
        </Link>
      </div>

      <table className="min-w-full table-auto border-collapse border border-gray-200 uppercase">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left font-medium text-gray-600">Name</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Username</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Phone</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Formateur</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <tr key={worker._id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{worker.name}</td>
              <td className="px-4 py-2">{worker.username}</td>
              <td className="px-4 py-2">{worker.phone}</td>
              <td className="px-4 py-2">{worker.formateur}</td>
              <td className="px-4 py-2">
                <div className="p-2 flex gap-2">
                  <Link
                    href={`/company/worker/${worker._id}`}
                    className="bg-green-600 hover:bg-green-500 p-4 rounded-md text-white"
                  >
                    <CiEdit size={25} />
                  </Link>
                  <button 
                                      type='button'
                                      onClick={() => handleDeleteClick(worker)}
                                      disabled={selected?._id === worker._id}
                                      className='bg-red-600 hover:bg-red-500 p-4 rounded-md text-white uppercase'>
                                      {selected?._id === worker._id ? "Processing..." : <RiDeleteBin5Line size={25}/> }
                                    </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isPopupOpen && selected && (
        <PopupDelete
          handleClosePopup={handleClosePopup}
          Delete={deleteWorker}
          id={selected._id}
          name={selected.name}
        />
      )}
    </div>
  );
};

export default Page;
