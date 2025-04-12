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

const CustomerTable: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<Customer | null>(null);
 
  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/company/customer/getallcustomer");

      if (!response.ok) {
        throw new Error("Failed to fetch workers");
      }

      const data = await response.json();
      setCustomers(data); // Update state with fetched data
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
    fetchCustomers();
  }, []);
  const handleDeleteClick = (customer: Customer) => {
    setSelected(customer);
    setIsPopupOpen(true);
  };

  const deletecustomer = async (workerId: string) => {
    try {
      const response = await fetch(
        `/api/company/customer/deletecustomer/${workerId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }
      fetchCustomers();
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
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelected(null);
  };
  
    
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4"> Table Client</h1>
      <div className="flex w-full justify-end pb-4">
        <Link
          href={"/company/customer/addcustomer"}
          className="bg-gray-800 p-4 rounded-md text-white"
        >
          Ajouter un client
        </Link>
      </div>
      <table className="w-full border-collapse border border-gray-200 uppercase">
        <thead>
          <tr className="bg-gray-100">
          <th className="px-4 py-2 text-left font-medium text-gray-600">
             RÉFÉRENCE
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Nom
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              prenom
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              CIN
            </th>
            
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Telephone
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
             address
            </th>
           
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4  font-bold">{customer.ref}</td>
            
              <td className="py-2 px-4">{customer.firstname} </td>
              <td className="py-2 px-4">{customer.lastname}</td>
              <td className="py-2 px-4  ">{customer.cin}</td>
              <td className="py-2 px-4">{customer.phone}</td>
             
              <td className="py-2 px-4">{customer.address}</td>
     
              
              <td className="py-2 px-4">
                <div className="p-2 flex gap-2">
                  <Link
                    href={`/company/customer/edit/${customer._id}`}
                    className="bg-green-600 hover:bg-green-500 p-4 rounded-md text-white"
                  >
                    <CiEdit size={25} />
                  </Link>
                  <Link
                    href={`/company/customer/${customer._id}`}
                    className="bg-gray-600 hover:bg-gray-500 p-4 rounded-md text-white"
                  >
                    <GrView  size={25} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(customer)}
                    disabled={selected?._id === customer._id}
                    className="bg-red-600 hover:bg-red-500 p-4 rounded-md text-white uppercase"
                  >
                    {selected?._id === customer._id ? (
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
          Delete={deletecustomer}
          id={selected._id}
          name={selected.firstname}
        />
      )}
   
    </div>
  );
};

export default CustomerTable;
