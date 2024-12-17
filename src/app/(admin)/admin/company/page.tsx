"use client";
import PopupDelete from '@/components/popup/DeletePopup';
import SubscriptionPopuo from '@/components/popup/SubscriptionPopuo';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { GiCash } from 'react-icons/gi';
import { RiDeleteBin5Line } from 'react-icons/ri';

interface Subscription {
  _id: number;
  name: string;
  life: string;
  price: string;
}

interface Company {
  _id: string;
  username: string;
  name: string;
  phone: string;
  on:string;
  subscription: Subscription; // Subscription details associated with the company
  datestart: string;
  datesub: string;
}

const CompanyTable = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpensub, setIsPopupOpensub] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Company | null>(null);
 const [subscriptions, setSubscriptions] = useState<Subscription[]>([]); 
 const [selectedSubscription, setSelectedSubscription] = useState<string | ''>('');
 const [companyid,setComanyid]=useState('');
 const handleSubChange = async () => {

  try {

    const response = await fetch(`/api/admin/company/revalidationcomapny/${companyid}`, {  // Replace with your API endpoint
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedSubscription),
    });
    if (!response.ok) {
      throw new Error('Failed to revalidate company');
    }
    // Handle success
    setSelectedSubscription(""); 
    setComanyid("");
    setIsPopupOpensub(false);
    fetchCompanies();
    // Optionally, reset form after submit
  
  } catch (error) {
    console.error('Error creating company:', error);
  }
};
  const handleDeleteClick = (company: Company) => {
    setSelected(company);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelected(null);
  };
  
  const handleClosesub = () => {
    setIsPopupOpensub(false);
  };
  const handlesubClick=(id:string)=>{
    setIsPopupOpensub(true);
    setComanyid(id)
  }

  const deleteCompany = async (companyId: string) => {
    try {
      const response = await fetch(`/api/admin/company/deletecompany/${companyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete company");
      }
      fetchCompanies();
      console.log('Deleted successfully');
    }  catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`Failed to delete company: ${err.message}`);
      } else {
        console.error('Failed to delete company: Unknown error');
      }
    } finally {
      handleClosePopup();
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/admin/company/getallcompany');

      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }

      const data: Company[] = await response.json();
      setCompanies(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

      const fetchSubscriptions = async () => {
        try {
          const response = await fetch('/api/admin/subscription/getsubscriptionactive');  // Replace with your actual API endpoint
          const data = await response.json();
          setSubscriptions(data);
        
        } catch (error) {
          console.error('Error fetching subscriptions:', error);
          
        }
      };
  
     

  useEffect(() => {
    fetchSubscriptions();
    fetchCompanies();
  
  }, []);

  function formatDate(dateInput: string) {
    const date = new Date(dateInput);

    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    const weekday = date.toLocaleString('default', { weekday: 'short' });

    return `${weekday} ${month} ${day} ${year} ${hour}:${minute}:${second}`;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Company Table</h1>
      <div className='flex w-full justify-end pb-4'>
        <Link href={'company/addcompany'} className=' bg-gray-800 p-4 rounded-md text-white'>
          Create Company
        </Link>
      </div>
      <table className="min-w-full table-auto border-collapse border border-gray-200 uppercase">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left font-medium text-gray-600">Username</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Company Name</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Phone</th>
            <th className='px-4 py-2 text-left font-medium text-gray-600'>date payment </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Subscription</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Date off Subscription</th>
            <th className='px-4 py-2 text-left font-medium text-gray-600'>Status</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company._id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{company.username}</td>
              <td className="px-4 py-2">{company.name}</td>
              <td className="px-4 py-2">{company.phone}</td>
              <td className="px-4 py-2">{formatDate(company.datestart)}</td>
              <td className="px-4 py-2">{company.subscription.name} - {company.subscription.life} day - {company.subscription.price} TND</td>
              <td className="px-4 py-2">{formatDate(company.datesub)}</td>
              <td className={`px-4 py-2 ${
                company.on ? 'text-green-500' : 'text-red-500'
              }`}>{company.on ? 'incur' : 'expired'}</td>
              <td className="px-4 py-2">
                <div className='flex gap-2 justify-center items-center'>
                <button 
                    type='button'
                    onClick={() => handlesubClick(company._id)}
                    className='bg-green-600 hover:bg-green-500 p-4 rounded-md text-white uppercase'>
                    <GiCash size={25}/> 
                  </button>


                  <Link
                    href={`company/${company._id}`}
                    className='bg-green-600 hover:bg-green-500 p-4 rounded-md text-white'>
                   <CiEdit size={25}/>
                  </Link>
                  <button 
                    type='button'
                    onClick={() => handleDeleteClick(company)}
                    disabled={selected?._id === company._id}
                    className='bg-red-600 hover:bg-red-500 p-4 rounded-md text-white uppercase'>
                    {selected?._id === company._id ? "Processing..." : <RiDeleteBin5Line size={25}/> }
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
          Delete={deleteCompany}
          id={selected._id}
          name={selected.name}
        />
      )}
     {isPopupOpensub && <SubscriptionPopuo 
      handleClosesub={handleClosesub}
      subscriptions={subscriptions}
      selectedSubscription={selectedSubscription} 
      setSelectedSubscription={setSelectedSubscription}
      handleSubChange={handleSubChange}
      />}
    </div>
  );
}

export default CompanyTable;
