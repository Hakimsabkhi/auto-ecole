"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ActivityType {
  _id: string;
  name: string;
}

const UpdateWorker = ({ params }: { params: Promise<{ id: string }> }) => {
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [predefinedActivities, setPredefinedActivities] = useState<ActivityType[]>([]);
  const route = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
    formateur: [] as ActivityType[],
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

  // Fetch activities
  const fetchActivityType = async () => {
    try {
      const response = await fetch("/api/company/activity/type/getalltype", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const data = await response.json();
      setPredefinedActivities(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  // Fetch predefined activities on initial render
  useEffect(() => {
    fetchActivityType();
  }, []);

  // Fetch worker data when params.id is available
  useEffect(() => {
    if (unwrappedParams?.id) {
      const fetchWorker = async () => {
        try {
          const response = await fetch(
            `/api/company/worker/getworkingbycompanywithid/${unwrappedParams.id}`
          );
          const { existingWorker } = await response.json();

          setFormData({
            name: existingWorker.name || "",
            username: existingWorker.username || "",
            phone: existingWorker.phone || "",
            password: "",
            formateur: existingWorker.formateur || [],
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

  // Add formateur
  const handleAddFormateur = (activity: ActivityType) => {
    if (activity && !formData.formateur.includes(activity)) {
      setFormData((prev) => ({
        ...prev,
        formateur: [...prev.formateur, activity],
      }));
    }
  };

  // Remove formateur
  const handleRemoveFormateur = (activity: ActivityType) => {
    setFormData((prev) => ({
      ...prev,
      formateur: prev.formateur.filter((act) => act !== activity),
    }));
  };

  // Submit form data
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/company/worker/updateworker/${unwrappedParams?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update worker");
      }

      // Reset form data after successful update
      setFormData({
        name: "",
        username: "",
        phone: "",
        password: "",
        formateur: [],
      });

      route.push("/company/worker");
    } catch (error) {
      console.error("Error updating worker:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Modifier des informations Moniteur / Monitrice d'auto-école
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
          <label htmlFor="formateur" className="block text-sm font-medium text-gray-700">
            Formateur:
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {predefinedActivities.map((activity) => (
              <button
                type="button"
                key={activity._id}
                onClick={() => handleAddFormateur(activity)}
                className={`px-4 py-2 border rounded-md text-sm ${
                  formData.formateur.includes(activity)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } hover:bg-blue-100`}
              >
                {activity.name}
              </button>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {formData.formateur.map((activity, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center space-x-2"
              >
                <span>{activity.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFormateur(activity)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
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
            href="/company/worker"
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
