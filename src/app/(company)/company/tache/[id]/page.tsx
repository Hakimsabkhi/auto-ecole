"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { formatDate } from '@/lib/timeforma';
import Link from 'next/link';
interface Customer {
  _id: string;
  ref:string;
  firstname: string;
  lastname:string;
}

interface Worker {
  _id: string;
  name: string;
  formateur: Activitetype[];
}

interface Activitetype {
  _id: string;
  name: string;
}
interface car{
  _id:string;
  model:string;
  bn:string;
}
const TacheFormupdate= ({ params }: { params: Promise<{ id: string }> }) => {
    const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
 const route= useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
 const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [OpenCustomer,setOpenCustomer]=useState<boolean>(false);
    const [options, setOptions] = useState<Activitetype[]>([]);
   const [workers, setWorkers] = useState<Worker[]>([]);
    const [cars, setCars] = useState<car[]>([]);
     const [prix,setPrix]=useState(0);
  const [formData, setFormData] = useState({
    customer: "",
    activities: "",
    car:"",
    mt: 0,
    mp: 0,
    nht: 0,
    nhe: 0,
    dateexam: "",
    worker:"",
  });
 
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
  const fetchActivitytype = async () => {
    try {
      const response = await fetch("/api/company/activity/type/getalltype", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workers");
      }

      const data = await response.json();
      setOptions(data); // Update state with fetched data
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
    if (unwrappedParams?.id) {
     
 const fetchActivity= async () => {
    try {
      const response = await fetch(`/api/company/activity/getactivity/${unwrappedParams?.id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch workers");
      }

      const {existingaActivite} = await response.json(); // Update state with fetched data

      setFormData({
        customer: existingaActivite.customer._id,
        activities: existingaActivite.activites,
       car:existingaActivite.car,
        mt: existingaActivite.mt,
        mp: existingaActivite.mp,
        nht: existingaActivite.nht,
        nhe: existingaActivite.nhe,
        dateexam:formatDate(existingaActivite.dateexam), 
        worker:existingaActivite.worker,
      });
      setSearchTerm(existingaActivite.customer.firstname)
      henderworkerchange( existingaActivite.activites._id)
      fetchActivitytype()
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  }
  
    fetchActivity();
    hendercar();
}
  }, [unwrappedParams]);

  async function henderworkerchange(id:string){
  try {
    const response = await fetch(
      `/api/company/worker/getworkerbyactivite/${id}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch workers");
    }

    const { existingWorker } = await response.json();
    setWorkers(existingWorker);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("An unknown error occurred");
    }
  }
};
async function hendercar(){
  try {
    const response = await fetch(
      `/api/company/car/getallcar/`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch workers");
    }
    
    const data = await response.json();
    setCars(data);
  
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("An unknown error occurred");
    }
  }
};
async function henderprix(value:string){
try {
  const response = await fetch(`/api/company/activity/type/gettype/${value}`)
  if (!response.ok) {
    throw new Error("Failed to fetch activite type");
  }
  console.log(value)
  const {existingatype} = await response.json();
  setPrix(existingatype.prix);

} catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
  } else {
    console.error("An unknown error occurred");
  }
}
}

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
   
    const newFormData = {
      ...formData,
      [name]:
        name === "mt" || name === "mp" || name === "nht" || name === "nhe"
          ? parseFloat(value)
          : value,
    };

    // Calculate 'mt' (Montant Total) based on 'nht' (Nombre d'heures Totale) and 'prix'
    if (name === "nht" || name === "activities") {
      newFormData.mt = newFormData.nht * prix;
    }

    setFormData(newFormData);
  };

  const handleChangeactivities = async (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      
      // Handle number fields separately to parse values correctly
      const { name, value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: ["mt", "mp", "nht", "nhe"].includes(name) ? parseFloat(value) : value,
      }));
      henderworkerchange(value)

      henderprix(value)
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
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

  

    // Submit form data to the API or handle as needed
    try {
      const response = await fetch(`/api/company/activity/updateactivity/${unwrappedParams?.id}`, {
        method: 'PUT',
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
        car:"",
        mt: 0,
        mp: 0,
        nht: 0,
        nhe: 0,
        dateexam: "",
        worker:""
      });
      route.push('/company/tache');
    
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="p-4 w-full bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-center mb-6">édite une Tâche</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
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
            onChange={handleChangeactivities}
            className="mt-1 block w-full px-3 py-2 border bg-transparent border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="" disabled>
              Select Activity
            </option>
            {options.map((option, index) => (
              <option key={index} value={option._id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
   {/* Worker Selection (Div-based) */}
   <div>
            <label
              htmlFor="worker"
              className="block text-sm font-medium text-gray-700 pb-1"
            >
              Moniteur
            </label>

            <select
              id="worker"
              name="worker"
              value={formData.worker}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border bg-transparent border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>
                {" "}
                Select Moniteur
              </option>
              {workers.map((worker, index) => (
                <option key={index} value={worker._id}>
                  {worker.name} -{" "}
                  {worker.formateur.map((item) => item.name).join(", ")}
                </option>
              ))}
            </select>
          </div>
                 {/* voiture Selection (Div-based) */}
   <div>
            <label
              htmlFor="worker"
              className="block text-sm font-medium text-gray-700 pb-1"
            >
              Voiture
            </label>

            <select
              id="car"
              name="car"
              value={formData.car}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border bg-transparent border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled defaultChecked>
                {" "}
                Select Voiture
              </option>
              {cars.map((car, index) => (
                <option key={index} value={car._id}>
                  {car.model} -{" "}
                  {car.bn}
                </option>
              ))}
            </select>
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
            Nombre d&apos;heures effecture
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
          <label htmlFor="mt" className="block text-sm font-medium text-gray-700">
            Montant Total
          </label>
          <input
            id="mt"
            name="mt"
            type="number"
            value={formData.mt}
            disabled
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>


              <div className='grid grid-rows-1 gap-2'>
        <button
            type="submit"
          className="w-full bg-gray-900 hover:bg-gray-700 text-white py-2 rounded-md"
        >
          Update Activities
        </button>
        <Link 
            href={"/company/tache"}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md flex justify-center"
        >
          Retour
        </Link>
        </div>
      </div>
      </form>
    </div>
  );
};

export default TacheFormupdate;
