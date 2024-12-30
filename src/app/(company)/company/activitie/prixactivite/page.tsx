"use client";

import PopupDelete from "@/components/popup/DeletePopup";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";




interface Activitetype {
  _id:string;
  name:string,
  prix:number,
}
const ActiviteTable: React.FC = () => {
  const [types, setTypes] = useState<Activitetype[]>([]);
     const [isPopupOpen, setIsPopupOpen] = useState(false);
    
        const [selected, setSelected] = useState<Activitetype | null>(null);
 
  const fetchActivitytype= async () => {
    try {
      const response = await fetch("/api/company/activity/type/getalltype", {
        method: 'GET'})

      if (!response.ok) {
        throw new Error("Failed to fetch workers");
      }

      const data = await response.json();
      setTypes(data); // Update state with fetched data
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
    fetchActivitytype();
  }, []);

  const handleDeleteClick = (activite: Activitetype) => {
    setSelected(activite);
    setIsPopupOpen(true);
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelected(null);
  };


  const deleteactivitytype = async (activiteid: string) => {
    try {
      const response = await fetch(
        `/api/company/activity/type/deletetype/${activiteid}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }
      fetchActivitytype();
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
      <h1 className="text-2xl font-semibold mb-4"> Activite Prix Table</h1>
      <div className="flex w-full justify-end  gap-2 pb-4">
      <Link
          href={"/company/activitie/"}
          className="bg-gray-800 p-4 rounded-md text-white"
        >
          Retour
        </Link>
        <Link
          href={"/company/activitie/prixactivite/addactivite"}
          className="bg-gray-800 p-4 rounded-md text-white"
        >
          Create Activite
        </Link>
      </div>
      <table className="w-full border-collapse border border-gray-200 uppercase">
        <thead>
          <tr className="bg-gray-100">
          <th className="px-4 py-2 text-left font-medium text-gray-600">
              Nom 
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
            prix
            </th>
           
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {types.map((item) => (
            <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4  font-bold">{item.name}</td>
            
              <td className="py-2 px-4">{item.prix} DT </td>
              
              
              
              <td className="py-2 px-4">
                <div className="p-2 flex gap-2">
                  <Link
                    href={`/company/activitie/prixactivite/${item._id}`}
                    className="bg-green-600 hover:bg-green-500 p-4 rounded-md text-white"
                  >
                    <CiEdit size={25} />
                  </Link>
                  
                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteClick(item)}
                                                        disabled={selected?._id === item._id}
                                                        className="bg-red-600 hover:bg-red-500 p-4 rounded-md text-white uppercase"
                                                      >
                                                        {selected?._id === item._id ? (
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
          Delete={deleteactivitytype}
          id={selected._id}
          name={selected.name}
        />
      )}
   
    </div>
  );
};

export default ActiviteTable;
