"use client";

import PopupDelete from "@/components/popup/DeletePopup";
import { formatDatetodate } from "@/lib/timeforma";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";



interface Car {
  _id: string;
  model:string;
  bn:string;
  vd:string;
 
}

const CarTable: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [selected, setSelected] = useState<Car | null>(null);
 
  const fetchCar = async () => {
    try {
      const response = await fetch("/api/company/car/getallcar");

      if (!response.ok) {
        throw new Error("Failed to fetch car");
      }

      const data = await response.json();
      setCars(data); // Update state with fetched data
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
    fetchCar();
  }, []);
  const handleDeleteClick = (car: Car) => {
    setSelected(car);
    setIsPopupOpen(true);
  };

  const deletecustomer = async (carId: string) => {
    try {
      const response = await fetch(
        `/api/company/car/deletecar/${carId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete car");
      }
      fetchCar();
      console.log("Deleted successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`Failed to delete car: ${err.message}`);
      } else {
        console.error("Failed to delete cra: Unknown error");
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
      <h1 className="text-2xl font-semibold mb-4"> Table Voiture</h1>
      <div className="flex w-full justify-end pb-4">
        <Link
          href={"/company/car/addcar"}
          className="bg-gray-800 p-4 rounded-md text-white"
        >
          Ajouter Voiture
        </Link>
      </div>
      <table className="w-full border-collapse border border-gray-200 uppercase">
        <thead>
          <tr className="bg-gray-100">
          <th className="px-4 py-2 text-left font-medium text-gray-600">
             Model
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Matricule
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              date de vidange
            </th>
            
           
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4  font-bold">{car.model}</td>
            
              <td className="py-2 px-4">{car.bn} </td>
              <td className="py-2 px-4">{formatDatetodate(car.vd).date}</td>
             
     
              
              <td className="py-2 px-4">
                <div className="p-2 flex gap-2">
                  <Link
                    href={`/company/car/${car._id}`}
                    className="bg-green-600 hover:bg-green-500 p-4 rounded-md text-white"
                  >
                    <CiEdit size={25} />
                  </Link>
                  
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(car)}
                    disabled={selected?._id === car._id}
                    className="bg-red-600 hover:bg-red-500 p-4 rounded-md text-white uppercase"
                  >
                    {selected?._id === car._id ? (
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
          name={selected.model}
        />
      )}
   
    </div>
  );
};

export default CarTable;