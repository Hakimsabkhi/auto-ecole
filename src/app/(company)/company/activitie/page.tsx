"use client";

import PopupDelete from "@/components/popup/DeletePopup";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { formatDate } from '@/lib/timeforma';


interface Customer {
  _id: string;
  ref:string;
  cin: number;
  firstname: string;
  lastname: string;
  phone: string;
  address:string
 
}
interface Activite {
  _id:string;
    ref: string;
    customer: Customer;
    activites: string;
    mt: string;
    mp: string;  // Changed to string to allow flexibility
    nht: string;
    nhe: string;
    dateexam: string;
    status:string;
}
const ActiviteTable: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activitys, setActivitys] = useState<Activite[]>([]);
    const [selected, setSelected] = useState<Activite | null>(null);
 
  const fetchActivity= async () => {
    try {
      const response = await fetch("/api/company/activity/getallactivity");

      if (!response.ok) {
        throw new Error("Failed to fetch workers");
      }

      const data = await response.json();
      setActivitys(data); // Update state with fetched data
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };
 
  
  // Fetch workers on initial render
  useEffect(() => {
    fetchActivity();
  }, []);
 
  const handleDeleteClick = (activite: Activite) => {
    setSelected(activite);
    setIsPopupOpen(true);
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelected(null);
  };

  const updateStatus = async (event: React.ChangeEvent<HTMLSelectElement>,activiteid:string) => {
    const status = event.target.value;
    try {
      const response = await fetch(`/api/company/activity/updateactivitystatus/${activiteid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(status),
      });

      if (!response.ok) {
        throw new Error("Failed to submit activity form");
      }

   
     fetchActivity();
    
    } catch (err) {
      console.error("Error submitting form:", err);
     
    }
  };


  const deleteactivity = async (activiteid: string) => {
    try {
      const response = await fetch(
        `/api/company/activity/deleteactivity/${activiteid}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }
      fetchActivity();
      console.log("Deleted successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`Failed to delete customer: ${err.message}`);
      } else {
        console.error("Failed to delete customer: Unknown error");
      }
    } finally {
      handleClosePopup();
    }
  };
    
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Activite Table</h1>
      <div className="flex w-full justify-end pb-4">
        <Link
          href={"/company/activitie/addactivitie"}
          className="bg-gray-800 p-4 rounded-md text-white"
        >
          Create Activite
        </Link>
      </div>
      <table className="w-full border-collapse border border-gray-200 uppercase">
        <thead>
          <tr className="bg-gray-100">
          <th className="px-4 py-2 text-left font-medium text-gray-600">
              REF 
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
            Activitie
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Client
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Montant Total
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Montant Payer
            </th>
            
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Nombre d&apos;heures totale
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Nomber d&apos;heures effectue
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              date d&apos;examen
             </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Statue
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {activitys.map((activity) => (
            <tr key={activity._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4  font-bold">{activity.ref}</td>
            
              <td className="py-2 px-4">{activity.activites} </td>
              <td className="py-2 px-4">{activity.customer.firstname} {activity.customer.lastname}</td>
              <td className="py-2 px-4  ">{activity.mt}</td>
              <td className="py-2 px-4">{activity.mp}</td>
             
              <td className="py-2 px-4">{activity.nht}</td>
              <td className="py-2 px-4">{activity.nhe}</td>
              <td className="py-2 px-4">{formatDate(activity.dateexam)||'N/A'}</td>
              <td className="py-2 px-4">  <select
            
            value={activity.status}
            onChange={(event)=>updateStatus(event,activity._id)} 
            className="mt-1 block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
           
            <option value="en-coure">En-coure</option>
            <option value="finish">Terminer</option>
            </select></td>
              
              <td className="py-2 px-4">
                <div className="p-2 flex gap-2">
                  <Link
                    href={`/company/activitie/${activity._id}`}
                    className="bg-green-600 hover:bg-green-500 p-4 rounded-md text-white"
                  >
                    <CiEdit size={25} />
                  </Link>
                  
                   <button
                                     type="button"
                                     onClick={() => handleDeleteClick(activity)}
                                     disabled={selected?._id === activity._id}
                                     className="bg-red-600 hover:bg-red-500 p-4 rounded-md text-white uppercase"
                                   >
                                     {selected?._id === activity._id ? (
                                       "Processing..."
                                     ) : (
                                       <RiDeleteBin5Line size={25} />
                                     )}
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
          Delete={deleteactivity}
          id={selected._id}
          name={selected.customer.firstname}
        />
      )}
   
    </div>
  );
};

export default ActiviteTable;
