"use client";
import HistoryPopup from "@/components/popup/HistoryPopup";
import PaymentPopupAccount from "@/components/popup/PaymentPopupAccount";
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
  const [openPay, setOpenPay] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [selectid,SetSelectid]= useState("");
  function closeHistory() {
    setOpenHistory(false);
    SetSelectid("");
  }
  function closepay() {
    setOpenPay(false);
    SetSelectid("");
  }
  const HistoryPay=(id:string)=>{
    setOpenHistory(true);
    SetSelectid(id);
  }
  const pay = (id: string) => {
    setOpenPay(true);
    SetSelectid(id);
  };

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
        tasks: [],
      };
    }
    acc[customerId].tasks.push(activity);
    return acc;
  }, {} as Record<string, { customer: Customer; tasks: Task[] }>);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Paiement</h1>

      <table className="w-full border-collapse border border-gray-200 uppercase">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Client
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Tâche
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Montant Total
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Montant Payer
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Statut
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.values(groupedByCustomer).map(({ customer, tasks }) =>
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
                <td className="py-2 px-4 flex flex-col-1 gap-1 items-center">
                  {task.mp} DT
                  <button 
                  type="button"
                  onClick={()=>pay(task._id)}
                
                  className="bg-gray-800 text-white p-1 rounded-sm">
                    <FaPlus size={15} />
                  </button>
                  <button 
                  type="button"
                  onClick={()=>HistoryPay(task._id)}
                  className="bg-gray-800 text-white p-1 rounded-sm">
                    {" "}
                    <FaEye size={15} />
                  </button>
                </td>
                {/* Statut */}
                <td className="py-2 px-4">
                  <label className="mt-1 block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    {task.status === "en-coure" && <span>En-cours</span>}
                    {task.status === "finish" && <span>Terminé</span>}
                  </label>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {openPay && <PaymentPopupAccount closepay={closepay}  selectid={selectid} fetchActivities={fetchActivities} />}
    {openHistory && <HistoryPopup  closeHistory={closeHistory} selectid={selectid} fetchActivities={fetchActivities}/>} 
    </div>
  );
};

export default ActiviteTable;
