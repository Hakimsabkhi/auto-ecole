"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface CustomerFormData {
  cin: string;
  firstname: string;
  lastname: string;
  phone: string; 
  activities: string[];
  total: number;
  avance: number;
  worker: Worker[]; // Changed from string[] to Worker[] to store full worker object
  numbheurestotal: number;
  numbheureseffectuer: number;
  dateexcode:string;
    dateexconduit:string;
    dateexpark:string;
}

interface Worker {
  _id: string;
  name: string;
  formateur: string;
}

const CustomerForm = ({ params }: { params: Promise<{ id: string }> }) => {
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const predefinedActivities = ["Code", "Conduit", "Parking"];
  const route = useRouter();
  const [formData, setFormData] = useState<CustomerFormData>({
    cin: '',
    firstname: "",
    lastname: "",
    phone: "",
    activities: [],
    total: 0,
    avance: 0,
    worker: [],
    numbheurestotal: 0,
    numbheureseffectuer: 0,
    dateexcode:"",
    dateexconduit:"",
    dateexpark:"",
  });
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split('T')[0];
  };
  useEffect(() => {
    const fetchParams = async () => {
      try {
        const unwrapped = await params; 
        setUnwrappedParams(unwrapped);
      } catch (error) {
        console.error("Error unwrapping params:", error);
      }
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (unwrappedParams?.id) {
      const fetchCustomers = async () => {
        try {
          const response = await fetch(
            `/api/company/customer/getcustomerbyid/${unwrappedParams.id}`
          );
          const { existingCustomer } = await response.json();
          console.log(existingCustomer.dateexcode);
          setFormData({
            cin: existingCustomer.cin,
            firstname: existingCustomer.firstname,
            lastname: existingCustomer.lastname,
            phone: existingCustomer.phone,
            activities: existingCustomer.activities,
            total: existingCustomer.total,
            avance: existingCustomer.avance,
            worker: existingCustomer.worker,
            numbheurestotal: existingCustomer.numbheurestotal,
            numbheureseffectuer: existingCustomer.numbheureseffectuer,
            dateexcode: formatDate(existingCustomer.dateexcode), // Format date
            dateexconduit: formatDate(existingCustomer.dateexconduit), // Format date
            dateexpark: formatDate(existingCustomer.dateexpark), // Format date
          });
        } catch (error) {
          console.error("Error fetching company data:", error);
        }
      };

      fetchCustomers();
    }
  }, [unwrappedParams?.id]);

  const fetchWorkers = async () => {
    try {
      const response = await fetch('/api/company/worker/getworkerbycompany');
      if (!response.ok) {
        throw new Error('Failed to fetch workers');
      }

      const data = await response.json();
      setWorkers(data); 
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "phone" && value.length > 8) return;
    if (name === "cin" && value.length > 8) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWorkerSelect = (workerId: string) => {
    setFormData((prev) => {
      const isSelected = prev.worker.some((worker) => worker._id === workerId);
      
      const updatedWorkers = isSelected
        ? prev.worker.filter((worker) => worker._id !== workerId)
        : [...prev.worker, workers.find(worker => worker._id === workerId)!];

      return {
        ...prev,
        worker: updatedWorkers, 
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/company/customer/updatecustomer/${unwrappedParams?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create customer");
      }

      setFormData({
        cin: '',
        firstname: "",
        lastname: "",
        phone: "",
        activities: [],
        total: 0,
        avance: 0,
        worker: [],
        numbheurestotal: 0,
        numbheureseffectuer: 0,
        dateexcode:"",
    dateexconduit:"",
    dateexpark:"",
      });
      route.push("/company/customer");
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  const handleAddActivity = (activity: string) => {
    if (activity && !formData.activities.includes(activity)) {
      setFormData((prev) => ({
        ...prev,
        activities: [...prev.activities, activity],
      }));
    }
  };

  const handleRemoveActivity = (activity: string) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.filter((act) => act !== activity),
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-semibold text-center mb-4">Customer Update</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Input fields for cin, firstname, lastname, phone */}
        <div>
          <label htmlFor="cin" className="block text-sm font-medium text-gray-700">
            CIN
          </label>
          <input
            type="text" // Changed to text to handle the phone number input as string
            id="cin"
            name="cin"
            value={formData.cin}
            onChange={handleChange}
            placeholder="Enter 8-digit CIN"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            placeholder="Enter first name"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            placeholder="Enter last name"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text" // Changed to text to handle the phone number input as string
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter 8-digit phone number"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        {/* Activities Field */}
        <div>
          <label htmlFor="activities" className="block text-sm font-medium text-gray-700">
            Activities
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {predefinedActivities.map((activity) => (
              <button
                type="button"
                key={activity}
                onClick={() => handleAddActivity(activity)}
                className={`px-4 py-2 border rounded-md text-sm ${formData.activities.includes(activity) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-100`}
              >
                {activity}
              </button>
            ))}
          </div>
          
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.activities.map((activity, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center space-x-2">
                <span>{activity}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveActivity(activity)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="total" className="block text-sm font-medium text-gray-700">
           Total Amount To Pay
          </label>
          <div className="flex items-center space-x-2">
          <input
            type="number"
            id="total"
            name="total"
            value={formData.total}
            onChange={handleChange}
            placeholder="Enter total hours"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <span className="text-gray-700">DT</span>
        </div>
        </div>
           {/* Avance */}
           <div>
  <label htmlFor="avance" className="block text-sm font-medium text-gray-700">
    Avance
  </label>
  <div className="flex items-center space-x-2">
    <input
      type="number"
      id="avance"
      name="avance"
      value={formData.avance}
      onChange={handleChange}
      placeholder="Enter total hours"
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
    <span className="text-gray-700">DT</span>
  </div>
</div>
        {/* Worker Selection */}
        <div>
          <label htmlFor="worker" className="block text-sm font-medium text-gray-700 pb-1">
            Formateur
          </label>
          <div className="grid grid-cols-8 gap-2">
            {workers.map((worker) => (
              <div
                key={worker._id}
                className={`cursor-pointer p-2 rounded-md border ${formData.worker.some(w => w._id === worker._id) ? 'bg-blue-100 border-blue-500' : 'border-gray-300'} hover:bg-blue-50`}
                onClick={() => handleWorkerSelect(worker._id)}
              >
                <span className={`text-sm ${formData.worker.some(w => w._id === worker._id) ? 'text-blue-600' : 'text-gray-700'}`}>
                  {worker.name} <br/>{worker.formateur}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="numbheurestotal" className="block text-sm font-medium text-gray-700">
            Number de Heures Total 
          </label>
          <div className="flex items-center space-x-2">
          <input
            type="number"
            id="numbheurestotal"
            name="numbheurestotal"
            value={formData.numbheurestotal}
            onChange={handleChange}
            placeholder="Enter total hours"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
           <span className="text-gray-700">H</span>
           </div>
        </div>
 {/* Total Hours Field */}
 <div>
          <label htmlFor="numbheureseffectuer" className="block text-sm font-medium text-gray-700">
          Number de Heures effectuer
          </label>
          <div className="flex items-center space-x-2">
          <input
            type="number"
            id="numbheureseffectuer"
            name="numbheureseffectuer"
            value={formData.numbheureseffectuer}
            onChange={handleChange}
            placeholder="Enter effect hours"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
           <span className="text-gray-700">H</span>
           </div>
        </div>
        {/* Other fields (total, avance, numbheurestotal, numbheureseffectuer) */}
         {/* date exam code */}
 <div>
          <label htmlFor="dateexcode" className="block text-sm font-medium text-gray-700">
         Date examin code
          </label>
          <div className="flex items-center space-x-2">
          <input
            type="date"
            id="dateexcode"
            name="dateexcode"
            value={formData.dateexcode||""}
            onChange={handleChange}
            placeholder="Enter effect hours"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          
           </div>
        </div>
         {/* date examin conduit */}
 <div>
          <label htmlFor="dateexconduit" className="block text-sm font-medium text-gray-700">
          Date examin conduit
          </label>
          <div className="flex items-center space-x-2">
          <input
            type="date"
            id="dateexconduit"
            name="dateexconduit"
            value={formData.dateexconduit||""}
            onChange={handleChange}
            placeholder="Enter effect hours"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
           
           </div>
        </div>
         {/* date examin park*/}
 <div>
          <label htmlFor="dateexpark" className="block text-sm font-medium text-gray-700">
          Date examin park
          </label>
          <div className="flex items-center space-x-2">
          <input
            type="date"
            id="dateexpark"
            name="dateexpark"
            value={formData.dateexpark||""}
            onChange={handleChange}
            placeholder="Enter effect hours"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
           
           </div>
        </div>
        {/* Submit Button */}
        <div className="mt-6 text-center flex gap-2">
          <Link
            href="/company/customer"
            className="w-full py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="w-full py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
