"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",

  });
                     
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/company/accountant/postaccountant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create accountant");
      }

      setFormData({
        name: "",
        username: "",
        phone: "",
        password: ""
      
      });
      router.push("/company/accountant");
    } catch (error) {
      console.error("Error creating worker:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-semibold text-center mb-4">
      Ajouter des informations Comptable d&apos;auto-école 
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
            placeholder="Enter le nom et prenom"
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
            onChange={handleChange}
            required
            placeholder="Enter username"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            maxLength={8} // Limits input to 8 characters
            placeholder="XXXXXXXX"
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
            placeholder="Enter mot de passe"
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
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
