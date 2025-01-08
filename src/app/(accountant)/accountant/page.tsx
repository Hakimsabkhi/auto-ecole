"use client";
import React, { useEffect, useState } from "react";
import { FaEye, FaPlus } from "react-icons/fa";
import { LuPenLine, LuTrash2 } from "react-icons/lu";

interface Customer {
  _id: string;
  ref: string;
  cin: number;
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
}
interface Task {
  _id: string;
  ref: string;
  customer: Customer;
  activites: Activite;
  car: Car;
  worker: Worker;
  mt: string;
  mp: string; // Changed to string to allow flexibility
  nht: string;
  nhe: string;
  dateexam: string;
  status: string;
}
interface Car {
  _id: string;
  model: string;
  bn: string;
}
interface Worker {
  _id: string;
  name: string;
}
interface Activite {
  _id: string;
  name: string;
}

const ActiviteTable: React.FC = () => {
  const [activities, setActivities] = useState<Task[]>([]);

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/accountant/task/getalltask");

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setActivities(data); // Update state with fetched data
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Group tasks by customer
  const groupedByCustomer = activities.reduce((acc, activity) => {
    const customerId = activity.customer._id;
    if (!acc[customerId]) {
      acc[customerId] = {
        customer: activity.customer,
        tasks: []
      };
    }
    acc[customerId].tasks.push(activity);
    return acc;
  }, {} as Record<string, { customer: Customer, tasks: Task[] }>);

 return (
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-semibold mb-4">Paiement</h1>

    <table className="w-full border-collapse border border-gray-200 uppercase">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2 text-left font-medium text-gray-600">Client</th>
          <th className="px-4 py-2 text-left font-medium text-gray-600">Tâche</th>
          <th className="px-4 py-2 text-left font-medium text-gray-600">Montant Total</th>
          <th className="px-4 py-2 text-left font-medium text-gray-600">Montant Payer</th>
          <th className="px-4 py-2 text-left font-medium text-gray-600">Statut</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(groupedByCustomer).map(({ customer, tasks }) => (
          // For each customer, create the first row with client information and task data
          tasks.map((task, index) => (
            <tr key={task._id} className="border-t hover:bg-gray-50">
              {/* Client name only appears on the first row for this customer */}
              {index === 0 && (
                <td rowSpan={tasks.length} className="py-2 px-4">
                  {customer.firstname} {customer.lastname}
                </td>
              )}
             <td className="py-2 px-4">{task.activites.name} </td>
              {/* Montant Total */}
              <td className="py-2 px-4">{task.mt} DT </td>
              {/* Montant Payer */}
              <td className="py-2 px-4 flex flex-col-1 gap-1 items-center">{task.mp} DT <button className="bg-gray-800 text-white p-1 rounded-sm"><FaPlus size={15}  /></button> <button className="bg-gray-800 text-white p-1 rounded-sm"> <FaEye size={15} /></button></td>
              {/* Statut */}
              <td className="py-2 px-4">
                <label className="mt-1 block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  {task.status === "en-coure" && <span>En-cours</span>}
                  {task.status === "finish" && <span>Terminé</span>}
                </label>
              </td>
            </tr>
          ))
        ))}
      </tbody>
    </table>
    <div className="z-50 fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-500 opacity-50"></div>
      <div className="flex items-center justify-center bg-gray-300 relative z-10 shadow-2xl rounded-3xl">
        <div className="w-[500px] p-6 rounded-lg">
               <h1 className="text-xl font-bold text-center">Historique de paiement</h1>
       
              <div className="flex flex-col justify-center items-center p-10">
                <div className="flex flex-row gap-4 justify-center items-center">
                <input className="border p-2  text-center w-1/4"/>
                <label >12 mai 2025</label>
                <button className="bg-gray-900 p-2 text-white rounded-md "><LuPenLine size={20}  /></button>
                <button className="bg-gray-900 p-2 text-white  rounded-md"><LuTrash2 size={20} /></button>
                </div>
               <hr className="bg-white w-full mt-2"/>
               <div className="flex flex-row gap-4 justify-center items-center mt-5">
                <label >Total</label>
                <input className="border px-6 py-2 text-center w-1/4"/>
                </div>
             
              <div className="flex flex-col-1 pt-6 gap-3 justify-center items-center text-white">
              <button className="bg-gray-900 hover:bg-gray-800 px-5 py-2  rounded-lg ">Confirmer</button>
              <button className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg ">Annuler</button>
              </div>
              </div>
          </div>
       </div>
      </div>
  </div>
);

};

export default ActiviteTable;
