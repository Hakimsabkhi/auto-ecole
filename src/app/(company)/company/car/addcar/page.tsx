"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {  useState } from "react";

interface CarFormData {
  model:string;
  bn: string;
  vd: string;
  
}


const CarForm: React.FC = () => {
 
  const route=useRouter()
  const [formData, setFormData] = useState<CarFormData>({
    model:'',
    bn: "",
    vd: "",
    
  });

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Handle input constraints for phone (only allow 8 digits)
    if (name === "model" && value.length > 3) return;
 // Handle input constraints for cin (only allow 8 digits)
 if (name === "bn" && value.length > 8) return;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Ensure phone is exactly 8 digits
 

    try {
      const response = await fetch("/api/company/car/postcar", {
        // Replace with your API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to create car");
      }
      // Handle success (you can redirect or show a success message here)

      // Optionally, reset form after submit
      setFormData({
        model:'',
        bn: "",
        vd: "",
       
      });
      route.push("/company/car");
    } catch (error) {
      console.error("Error creating car:", error);
    }
    // Add your submission logic here
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-semibold text-center mb-4">Ajouter des informations voiteur</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* First Name Field */}
        {/* Phone Field */}
        <div>
          <label htmlFor="cin" className="block text-sm font-medium text-gray-700">
            Model
          </label>
          <input
            type="text" // Changed to text to handle the phone number input as string
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Enter Model voiteur"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="bn" className="block text-sm font-medium text-gray-700">
            Matricule
          </label>
          <input
            type="text"
            id="bn"
            name="bn"
            value={formData.bn}
            onChange={handleChange}
            placeholder="Enter le matricule"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Last Name Field */}
        <div>
          <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
            Date de vidange
          </label>
          <input
            type="date"
            id="vd"
            name="vd"
            value={formData.vd}
            onChange={handleChange}
             
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-center flex gap-2">
          <Link
            href="/company/car"
            className="w-full py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-400 transition duration-200"
          >
            Annuler
          </Link>
          <button
            type="submit"
            className="w-full py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarForm;
