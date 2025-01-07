"use client";

import PopupDelete from "@/components/popup/DeletePopup";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { formatDate } from "@/lib/timeforma";

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
  activites: activite;
  car: car;
  worker: worker;
  mt: string;
  mp: string; // Changed to string to allow flexibility
  nht: string;
  nhe: string;
  dateexam: string;
  status: string;
}
interface car {
  _id: string;
  model: string;
  bn: string;
}
interface worker {
  _id: string;
  name: string;
}
interface activite {
  _id: string;
  name: string;
}
const ActiviteTable: React.FC = () => {
  const [activitys, setActivitys] = useState<Task[]>([]);

  const fetchActivity = async () => {
    try {
      const response = await fetch("/api/accountant/task/getalltask");

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
      <h1 className="text-2xl font-semibold mb-4"> Tableau Tâches</h1>

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
          </tr>
        </thead>
        <tbody>
          {activitys.map((activity) => (
            <tr key={activity._id} className="border-t hover:bg-gray-50">
              <td className="py-2 px-4  font-bold">{activity.ref}</td>

              <td className="py-2 px-4">{activity.activites.name} </td>
              <td className="py-2 px-4">{activity.worker.name} </td>
              <td className="py-2 px-4">
                {" "}
                {activity.car
                  ? `${activity.car.model} ${activity.car.bn}`
                  : "N/A"}{" "}
              </td>
              <td className="py-2 px-4">
                {activity.customer.firstname} {activity.customer.lastname}
              </td>
              <td className="py-2 px-4  ">{activity.mt} DT</td>
              <td className="py-2 px-4">{activity.mp} DT</td>

              <td className="py-2 px-4">{activity.nht} H</td>
              <td className="py-2 px-4">{activity.nhe} H</td>
              <td className="py-2 px-4">
                {" "}
                {activity.dateexam ? formatDate(activity.dateexam) : "N/A"}
              </td>
              <td className="py-2 px-4">
                <label className="mt-1 block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  {activity.status === "en-coure" && <span >En-cours</span>}
                  {activity.status === "finish" && <span>Terminé</span>}
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiviteTable;
