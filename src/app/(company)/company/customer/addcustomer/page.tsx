"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {  useState } from "react";

interface CustomerFormData {
  cin:string;
  firstname: string;
  lastname: string;
  phone: string; // Changed from number to string for flexibility
  address:string;
}


const CustomerForm: React.FC = () => {
 
  const route=useRouter()
  const [formData, setFormData] = useState<CustomerFormData>({
    cin:'',
    firstname: "",
    lastname: "",
    phone: "",
    address:"",
  });

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Handle input constraints for phone (only allow 8 digits)
    if (name === "phone" && value.length > 8) return;
 // Handle input constraints for cin (only allow 8 digits)
 if (name === "cin" && value.length > 8) return;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Ensure phone is exactly 8 digits
    if (formData.phone.length !== 8) {
      alert("Phone number must be exactly 8 digits.");
      return;
    }

    try {
      const response = await fetch("/api/company/customer/postcustomer", {
        // Replace with your API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to create customer");
      }
      // Handle success (you can redirect or show a success message here)

      // Optionally, reset form after submit
      setFormData({
        cin:'',
        firstname: "",
        lastname: "",
        phone: "",
        address:"",
      });
      route.push("/company/customer");
    } catch (error) {
      console.error("Error creating customer:", error);
    }
    // Add your submission logic here
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-semibold text-center mb-4">Customer Form</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* First Name Field */}
        {/* Phone Field */}
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

        {/* Last Name Field */}
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

        {/* Phone Field */}
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
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
          </label>
          <input
            type="text" // Changed to text to handle the phone number input as string
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="xx street xxx /xxx/xxx"
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
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
