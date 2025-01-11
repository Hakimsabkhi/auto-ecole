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
interface Task {
  _id:string;
    ref: string;
    customer: Customer;
    activites: activite;
    car:car;
    worker:worker;
    mt: string;
    mp: string;  // Changed to string to allow flexibility
    nht: string;
    nhe: string;
    dateexam: string;
    status:string;
}
interface car{
  _id:string;
  model:string;
  bn:string;
}
interface worker {
  _id:string;
  name:string;
}
interface activite{
  _id:string;
  name:string;
}
const ActiviteTable: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activitys, setActivitys] = useState<Task[]>([]);
    const [selected, setSelected] = useState<Task | null>(null);
 
  const fetchActivity= async () => {
    try {
      const response = await fetch("/api/company/task/getalltask");

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
 
  const handleDeleteClick = (task: Task) => {
    setSelected(task);
    setIsPopupOpen(true);
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelected(null);
  };

  const updateStatus = async (event: React.ChangeEvent<HTMLSelectElement>,activiteid:string) => {
    const status = event.target.value;
    try {
      const response = await fetch(`/api/company/task/updatetaskstatus/${activiteid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(status),
      });

      if (!response.ok) {
        throw new Error("Failed to submit task form");
      }

   
     fetchActivity();
    
    } catch (err) {
      console.error("Error submitting form:", err);
     
    }
  };


  const deleteactivity = async (activiteid: string) => {
    try {
      const response = await fetch(
        `/api/company/task/deletetask/${activiteid}`,
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
      <h1 className="text-2xl font-semibold mb-4"> Tableau Tâches</h1>
      <div className="flex w-full justify-end  gap-2 pb-4">
        <Link
          href={"/company/tache/addtache"}
          className="bg-gray-800 p-4 rounded-md text-white"
        >
          Créer une Tâche
        </Link>
        <Link
          href={"/company/tache/activite/"}
          className="bg-gray-800 p-4 rounded-md text-white"
        >
          List  Activite
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
            Moniteur / Monitrice
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
            Voiteur
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Client
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Montant Total
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
            Montant Payé
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
            
              <td className="py-2 px-4">{activity.activites.name} </td>
              <td className="py-2 px-4">{activity.worker.name} </td>
              <td className="py-2 px-4"> {activity.car ? `${activity.car.model} ${activity.car.bn}` : 'N/A'} </td>
              <td className="py-2 px-4">{activity.customer.firstname} {activity.customer.lastname}</td>
              <td className="py-2 px-4  ">{activity.mt} DT</td>
              <td className="py-2 px-4">{activity.mp} DT</td>
             
              <td className="py-2 px-4">{activity.nht} H</td>
              <td className="py-2 px-4">{activity.nhe} H</td>
              <td className="py-2 px-4"> {activity.dateexam ? formatDate(activity.dateexam) : 'N/A'}</td>
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
                    href={`/company/tache/${activity._id}`}
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
