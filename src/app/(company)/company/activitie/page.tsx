"use client";

import PopupDelete from "@/components/popup/DeletePopup";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { GrView } from "react-icons/gr";
import { RiDeleteBin5Line } from "react-icons/ri";



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
    customerid: Customer;
    activites: string;
    mt: string;
    mp: string;  // Changed to string to allow flexibility
    nht: string;
    nhe: string;
    dateexam: string;
    status:string;
}
const ActiviteTable: React.FC = () => {
  
  const [activitys, setActivitys] = useState<Activite[]>([]);
  
 
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
              Nombre D'heures totale
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Nomber d'heures effectue
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              date d'examen
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
              <td className="py-2 px-4">{activity.customerid.firstname} {activity.customerid.lastname}</td>
              <td className="py-2 px-4  ">{activity.mt}</td>
              <td className="py-2 px-4">{activity.mp}</td>
             
              <td className="py-2 px-4">{activity.nht}</td>
              <td className="py-2 px-4">{activity.nhe}</td>
              <td className="py-2 px-4">{activity.dateexam}</td>
              <td className="py-2 px-4">{activity.status}</td>
              
              <td className="py-2 px-4">
                <div className="p-2 flex gap-2">
                  <Link
                    href={`/comapny/activite/edit/${activity._id}`}
                    className="bg-green-600 hover:bg-green-500 p-4 rounded-md text-white"
                  >
                    <CiEdit size={25} />
                  </Link>
                  <Link
                    href={`/company/activite/${activity._id}`}
                    className="bg-gray-600 hover:bg-gray-500 p-4 rounded-md text-white"
                  >
                    <GrView  size={25} />
                  </Link>
                  <button
                    type="button"
                   
                    className="bg-red-600 hover:bg-red-500 p-4 rounded-md text-white uppercase"
                  >
                    
                      <RiDeleteBin5Line size={25} />
                  
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
   
    </div>
  );
};

export default ActiviteTable;
