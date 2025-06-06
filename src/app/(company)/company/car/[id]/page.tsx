"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface CarFormData {
  model:string;
  bn: string;
  vd: string;
  
}




const CarEdit= ({ params }: { params: Promise<{ id: string }> }) => {
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);

  const route = useRouter();
  const [formData, setFormData] = useState<CarFormData>({
    model:'',
    bn: "",
    vd: "",
    
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
      const fetchCar = async () => {
        try {
          const response = await fetch(
            `/api/company/car/getcarbyid/${unwrappedParams.id}`
          );
          const { existingCar } = await response.json();
     
          setFormData({
            model: existingCar.model,
            bn: existingCar.bn,
            vd: existingCar.vd,
            
          });
        } catch (error) {
          console.error("Error fetching car data:", error);
        }
      };

      fetchCar();
    }
  }, [unwrappedParams?.id]);

 


  const handleChange = (e: React.ChangeEvent<HTMLInputElement >) => {
    const { name, value } = e.target;

    

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/company/car/updatecar/${unwrappedParams?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create car");
      }

      setFormData({
        model: '',
        bn: "",
        vd: "",
       
      });
      route.push("/company/car");
    } catch (error) {
      console.error("Error update car:", error);
    }
  };

 
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-semibold text-center mb-4"> Modifier des informations Voiture</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Input fields for cin, firstname, lastname, phone */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">
            Model
          </label>
          <input
            type="text" // Changed to text to handle the phone number input as string
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Enter Model voiture"
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
            placeholder="Enter le nom"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="vd" className="block text-sm font-medium text-gray-700">
            Date de vidange
          </label>
          <input
            type="date"
            id="vd"
            name="vd"
            value={formData.vd ? formData.vd.split('T')[0] : ''}
            onChange={handleChange}
            placeholder="Enter date de vidange"
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
            Sauvegarder Modification
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarEdit;
