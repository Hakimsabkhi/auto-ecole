"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";



const UpdateWorker = ({ params }: { params: Promise<{ id: string }> }) => {
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);

  const route = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",

  });

  // Unwrap params on mount
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

       

  // Fetch worker data when params.id is available
  useEffect(() => {
    if (unwrappedParams?.id) {
      const fetchWorker = async () => {
        try {
          const response = await fetch(
            `/api/company/accountant/getaccountantwithid/${unwrappedParams.id}`
          );
          const { existingAccountant } = await response.json();

          setFormData({
            name: existingAccountant.name || "",
            username: existingAccountant.username || "",
            phone: existingAccountant.phone || "",
            password: "",
          });
        } catch (error) {
          console.error("Error fetching worker data:", error);
        }
      };

      fetchWorker();
    }
  }, [unwrappedParams?.id]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  // Submit form data
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/company/accountant/updateaccountant/${unwrappedParams?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update accountant");
      }

      // Reset form data after successful update
      setFormData({
        name: "",
        username: "",
        phone: "",
        password: "",
       
      });

      route.push("/company/accountant");
    } catch (error) {
      console.error("Error updating accountant:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Modifier des informations Comptable d&apos;auto-école
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom et Prenom:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Telephone:
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            pattern="^\d{8}$"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mt-6 text-center flex gap-2">
          <Link
            href="/company/accountant"
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

export default UpdateWorker;
