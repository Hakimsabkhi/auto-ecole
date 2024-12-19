"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const UpdateWorker = ({ params }: { params: Promise<{ id: string }> }) => {
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(
    null
  );

  const route = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
    formateur: "",
  });
  useEffect(() => {
    const fetchParams = async () => {
      try {
        const unwrapped = await params; // Unwrap the Promise
        setUnwrappedParams(unwrapped); // Store unwrapped params
      } catch (error) {
        console.error("Error unwrapping params:", error);
      }
    };

    fetchParams();
  }, [params]);
  useEffect(() => {
    if (unwrappedParams?.id) {
      const fetchWorker = async () => {
        try {
          const response = await fetch(
            `/api/company/worker/getworkingbycompanywithid/${unwrappedParams.id}`
          );
          const { existingWorker } = await response.json();

          setFormData({
            name: existingWorker.name,
            username: existingWorker.username,
            phone: existingWorker.phone,
            password: "",
            formateur: existingWorker.formateur,
          });
        } catch (error) {
          console.error("Error fetching company data:", error);
        }
      };

      fetchWorker();
    }
  }, [unwrappedParams?.id]);
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
    // Handle form submission logic here, e.g., send the data to an API

    try {
      const response = await fetch(
        `/api/company/worker/updateworker/${unwrappedParams?.id}`,
        {
          // Replace with your API endpoint
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create worker");
      }
      // Handle success (you can redirect or show a success message here)

      // Optionally, reset form after submit
      setFormData({
        name: "",
        username: "",
        phone: "",
        password: "",
        formateur: "",
      });
      route.push("/company/worker");
    } catch (error) {
      console.error("Error creating worker:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Update Information Worker
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name:
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
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone:
          </label>
          <input
            type="number"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            minLength={8}
            maxLength={8}
            pattern="^\d{8}$"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="formateur"
            className="block text-sm font-medium text-gray-700"
          >
            Formateur:
          </label>
          <select
            id="formateur"
            name="formateur"
            value={formData.formateur}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="" disabled>
              Select Formateur
            </option>
            <option value="Code">Code</option>
            <option value="Conuit et parking">Conuit et parking</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password:
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
            href="/company/worker"
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

export default UpdateWorker;
