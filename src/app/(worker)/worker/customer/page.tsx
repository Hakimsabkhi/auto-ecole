"use client";
import React, { useState, useEffect } from 'react';

interface Customer {
  cin: number;
  firstname: string;
  lastname: string;
  phone?: number;
  company?: string;
  activities?: string[];
  total?: number;
  avance?: number;
  numbheurestotal?: number;
  numbheureseffectuer?: number;
  dateexcode?: Date;
  dateexconduit?: Date;
  dateexpark?: Date;
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const formatDateexam = (date: string | Date | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };
  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/worker/getcustomerbyactiv");

      if (!response.ok) {
        throw new Error("Failed to fetch workers");
      }

      const data = await response.json();
      setCustomers(data); // Updating the state with the fetched data
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    fetchCustomers(); // Fetching customer data when component mounts
  }, []);

  return (
    <div className='container mx-auto p-4'>
      <div className="grid grid-cols-1 max-lg:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <div key={customer.cin} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
            <h2 className="text-xl font-semibold mb-4">{customer.firstname} {customer.lastname}</h2>
            <div className="mb-2">
              <strong>CIN:</strong> {customer.cin}
            </div>
            <div className="mb-2">
              <strong>Phone:</strong> {customer.phone || 'N/A'}
            </div>
            <div className="mb-2">
              <strong>Total:</strong> {customer.total || 'N/A'}
            </div>
            <div className="mb-2">
              <strong>Activities:</strong> {customer.activities?.join(', ') || 'N/A'}
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex-1 text-center">
                <div className="font-semibold">Total Hours</div>
                <div>{customer.numbheurestotal || '0'}</div>
              </div>
              <div className="flex-1 text-center">
                <div className="font-semibold">Hours Worked</div>
                <div>{customer.numbheureseffectuer || '0'}</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <div><strong>Ex Code Date:</strong> {formatDateexam(customer.dateexcode) || 'N/A'}</div>
              <div><strong>Ex Conduit Date:</strong> {formatDateexam(customer.dateexconduit) || 'N/A'}</div>
              <div><strong>Ex Park Date:</strong> {formatDateexam(customer.dateexpark) || 'N/A'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;
