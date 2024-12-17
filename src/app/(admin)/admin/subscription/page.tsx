"use client"; // Ensure that it's client-side only if using Next.js 13+ with App Router

import PopupDelete from '@/components/popup/DeletePopup';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { CiEdit } from 'react-icons/ci';
import { RiDeleteBin5Line } from 'react-icons/ri';

// Define a type for the subscription object
interface Subscription {
  _id: string;
  name: string;
  status: string;
  price: string;
  life:string;
}

const Page = () => {
  // State to store subscription data
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedsub, setselectedsub] = useState<Subscription | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Simulating a data fetch or subscription (e.g., from an API)
  const handleDeleteClick = (sb: Subscription) => {
    setselectedsub(sb);
    setIsPopupOpen(true);
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setselectedsub(null);
  };
  const deletesubscription = async (subId: string) => {
    try {
      const response = await fetch(`/api/admin/subscription/deletesubscription/${subId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete subscription");
      }

      fetchSubscriptions();
     // toast.success(" deleted successfully!");
     console.log('deleted successfully');
    }  catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`Failed to delete subscription: ${err.message}`);
      } else {
        console.error('Failed to delete subscription: Unknown error');
      }
    
    } finally {
      handleClosePopup();
    }
  };
  
  const updatesubscriptionStatus = async (subId: string, newStatus: string) => {
    try {
      const updateFormData = new FormData();
      updateFormData.append("vadmin", newStatus);

      const response = await fetch(`/api/admin/subscription/updatesubscriptionstatus/${subId}`, {
        method: "PUT",
        body: updateFormData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      fetchSubscriptions();
      console.log(" status updated successfully:");
    } catch (error) {
      console.error("Failed to update  status:", error);
     
    }
  };



  const fetchSubscriptions = async () => {
    try {
      // Fetch data from the API endpoint
      const response = await fetch('/api/admin/subscription/getsubscription');
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }

      const data = await response.json();
      setSubscriptions(data);  // Update state with fetched data
    } catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
  } else {
    console.error('An unknown error occurred');
  }
    } finally {
      setLoading(false);  // Set loading state to false after fetch completes
    }
  };
  useEffect(() => {
   

    fetchSubscriptions();
  }, []);  
  if (loading) {
    return <div>Loading...</div>;  // Show a loading message while data is being fetched
  }

  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Subscription Table</h1>
      <div className='flex w-full justify-end pb-4'>
    <Link href={'subscription/addsubscription'}  className=' bg-gray-800 p-4 rounded-md text-white'>
    Create subscription
    </Link>
    </div>
      <table className="min-w-full table-auto border-collapse border border-gray-200 uppercase">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left font-medium text-gray-600">Name</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Price</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Life Day</th> 
            <th className="px-4 py-2 text-left font-medium text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription) => (
            <tr key={subscription._id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{subscription.name}</td>
              <td className="px-4 py-2">{subscription.status}</td>
              <td className="px-4 py-2">{subscription.price} TND</td>
              <td className="px-4 py-2">{subscription.life} DAY</td>
              <td className="px-4 py-2">
                <div className='p-2 flex gap-2'>
                  
                <select
                    className={`w-50 text-white rounded-md p-2 ${
                      subscription.status === "Inactive"
                        ? "bg-gray-400 text-white"
                        : "bg-green-500 text-white"
                    }`}
                    value={subscription.status}
                    onChange={(e) =>
                      updatesubscriptionStatus(subscription._id, e.target.value)
                    }
                  >
                    <option value="Active" className="text-white uppercase">
                      Active
                    </option>
                    <option
                      value="Inactive"
                      className="text-white uppercase"
                    >
                     Inactive
                    </option>
                  </select>
                  <Link
                href={`subscription/${subscription._id}`}
                className='bg-green-600 hover:bg-green-500 p-4 rounded-md text-white'
                > <CiEdit size={25}/></Link>
                <button 
                type='button'
                onClick={() => handleDeleteClick(subscription)}
                disabled={selectedsub?._id === subscription._id}
                className='bg-red-600 hover:bg-red-500 p-4 rounded-md text-white uppercase'>
                   {selectedsub?._id === subscription._id ? "Processing..." :  <RiDeleteBin5Line size={25}/>}
                </button>
                
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isPopupOpen && selectedsub && (
        <PopupDelete
          handleClosePopup={handleClosePopup}
          Delete={deletesubscription}
          id={selectedsub._id}
          name={selectedsub.name}
        />
      )}
    </div>
  );
};

export default Page;
