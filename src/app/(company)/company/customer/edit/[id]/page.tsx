"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface CustomerFormData {
  cin: string;
  firstname: string;
  lastname: string;
  phone: string; 
  address:string;
  
}



const CustomerForm = ({ params }: { params: Promise<{ id: string }> }) => {
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);

  const route = useRouter();
  const [formData, setFormData] = useState<CustomerFormData>({
    cin: '',
    firstname: "",
    lastname: "",
    phone: "",
    address:"",
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
            address:existingCustomer.address
          });
        } catch (error) {
          console.error("Error fetching company data:", error);
        }
      };

      fetchCustomers();
    }
  }, [unwrappedParams?.id]);

 


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "phone" && value.length > 8) return;
    if (name === "cin" && value.length > 8) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        address:"",
      });
      route.push("/company/customer");
    } catch (error) {
      console.error("Error creating customer:", error);
    }
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

<div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            address
          </label>
          <input
            type="text" // Changed to text to handle the phone number input as string
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="xx street xxx/xxxxxx/xxxx"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
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
