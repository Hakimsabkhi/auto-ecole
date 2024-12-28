"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Customer {
  _id: string;
  ref:string;
  firstname: string;
  lastname:string;
}
interface Worker {
  _id: string;
  name: string;
  formateur: string[];
}
const ActivitiesForm: React.FC = () => {
 const route= useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
 const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [OpenCustomer,setOpenCustomer]=useState<boolean>(false);
  const [workers, setWorkers] = useState<Worker[]>([]);

  const fetchWorkers = async () => {
    try {
      const response = await fetch('/api/company/worker/getworkerbycompany');
      if (!response.ok) {
        throw new Error('Failed to fetch workers');
      }

      const data = await response.json();
      setWorkers(data); // Update state with fetched data
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
  };

  // Fetch workers on initial render

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/company/customer/getallcustomer");

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
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

  // Fetch customers on initial render
  useEffect(() => {
    fetchCustomers();
    fetchWorkers();
  }, []);

  const [formData, setFormData] = useState({
    customer: "",
    activities: "",
    mt: 0,
    mp: 0,
    nht: 0,
    nhe: 0,
    dateexam: "",
    worker:"",
  });

  const options: string[] = ["Code", "Conuit", "Parking"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle number fields separately to parse values correctly
    setFormData({
      ...formData,
      [name]: name === 'mt' || name === 'mp' || name === 'nht' || name === 'nhe' ? parseFloat(value) : value,
    });
  };
    

  const handleSearchCustomers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
  
    // Filter the customers based on the query (search by username or other customer properties)
    const filteredCustomers = customers.filter((cust) =>
      cust.firstname.toLowerCase().includes(searchTerm.toLowerCase())&&
    cust.lastname.toLowerCase().includes(searchTerm.toLowerCase())&&
    cust.ref.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setOpenCustomer(true);
    setFilteredCustomers(filteredCustomers); // Update the filtered customer list
  };
  const handleCustomerSelect = (customer: string, firstname: string) => {
    setOpenCustomer(false);
    setSearchTerm(firstname);  // Set the search term to the selected username
    setFormData({ ...formData, customer: customer });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer|| !formData.activities || !formData.mt  || !formData.nht ) {
      alert('Please fill in all fields');
      return;
    }

    // Submit form data to the API or handle as needed
    try {
      const response = await fetch('/api/company/activity/postactivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit activity form");
      }

    
     setFormData({
        customer: "",
        activities: "",
        mt: 0,
        mp: 0,
        nht: 0,
        nhe: 0,
        dateexam: "",
        worker:""
      });
      route.push('/company/activitie');
    
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="p-4 w-full bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-center mb-6">Activity Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {/* Search Input */}
        <div>
        <label htmlFor="customer">Customer</label>
      <div className="relative">
        <input
          id="customer"
          type="text"
            className=" p-2 border  rounded-sm mb-3 w-full"
          placeholder="Search customer by name"
          value={searchTerm}
          onChange={handleSearchCustomers} // Call this on input change
        />
        <ul className="absolute top-full mt-1 w-full bg-white  rounded-md shadow-md max-h-60 overflow-auto">
          {OpenCustomer && filteredCustomers.map((cust) => (
            <li
              key={cust._id}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleCustomerSelect(cust._id, cust.firstname)}
            >
             {cust.ref} {cust.firstname} {cust.lastname}
            </li>
          ))}
        </ul>
      </div>
        </div>



        <div>
          <label htmlFor="activities" className="block text-sm font-medium text-gray-700">
            Activities:
          </label>
          <select
            id="activities"
            name="activities"
            value={formData.activities}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border bg-transparent border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="" disabled>
              Select Activity
            </option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="mt" className="block text-sm font-medium text-gray-700">
            Montant Total
          </label>
          <input
            id="mt"
            name="mt"
            type="number"
            value={formData.mt}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
   {/* Worker Selection (Div-based) */}
   <div>
     <label htmlFor="worker" className="block text-sm font-medium text-gray-700 pb-1">
            Moniteur
          </label>
     <div className="grid grid-cols-8 gap-2">
     <select 
      id="worker"
      name="worker"
      value={formData.worker}
      onChange={handleChange}
      className="mt-1 block w-full px-3 py-2 border bg-transparent border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
     >
      <option value='' disabled  selected> Select Moniteur</option>
  {workers.map((worker) => (
   <option key={worker._id} value={worker.name}>
   {worker.name} - {worker.formateur.join(", ")}
 </option>
 
  ))}
</select>

        </div>
        </div>
        <div>
          <label htmlFor="mp" className="block text-sm font-medium text-gray-700">
            Montant Payer
          </label>
          <input
            id="mp"
            name="mp"
            type="number"
            value={formData.mp}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="nht" className="block text-sm font-medium text-gray-700">
            Nombre d&apos;heures Totale 
          </label>
          <input
            id="nht"
            name="nht"
            type="number"
            value={formData.nht}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="nhe" className="block text-sm font-medium text-gray-700">
            Nombre D&apos;heures effecture
          </label>
          <input
            id="nhe"
            name="nhe"
            type="number"
            value={formData.nhe}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="dateexam" className="block text-sm font-medium text-gray-700">
         Date d&apos;examen
          </label>
          <input
            id="dateexam"
            name="dateexam"
            type="datetime-local"
            value={formData.dateexam}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
            type="submit"
          className="w-full bg-gray-900 hover:bg-gray-700 text-white py-2 rounded-md"
        >
          Generate Activities
        </button>
      </div>
      </form>
    </div>
  );
};

export default ActivitiesForm;
