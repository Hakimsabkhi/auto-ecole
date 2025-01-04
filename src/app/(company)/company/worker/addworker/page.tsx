"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState ,useEffect} from "react";
  interface activitytype{
    _id:string;
    name:string;
  }
const Page = () => {
  const router = useRouter();
  const [predefinedActivities ,setPredefinedAcrivities ]= useState<activitytype[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
    formateur: [] as activitytype[],
  });
const fetchActivitytype= async () => {
    try {
      const response = await fetch("/api/company/activity/type/getalltype", {
        method: 'GET'})

      if (!response.ok) {
        throw new Error("Failed to fetch workers");
      }

      const data = await response.json();
      setPredefinedAcrivities(data); // Update state with fetched data
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };
 
  
  // Fetch workers on initial render
  useEffect(() => {
    fetchActivitytype();
  }, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddFormateur = (formateur: activitytype) => {
    if (!formData.formateur.includes(formateur)) {
      setFormData((prev) => ({
        ...prev,
        formateur: [...prev.formateur, formateur],
      }));
    }
  };

  const handleRemoveFormateur = (formateur: activitytype) => {
    setFormData((prev) => ({
      ...prev,
      formateur: prev.formateur.filter((item) => item !== formateur),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/company/worker/postworker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create worker");
      }

      setFormData({
        name: "",
        username: "",
        phone: "",
        password: "",
        formateur: [],
      });
      router.push("/company/worker");
    } catch (error) {
      console.error("Error creating worker:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-semibold text-center mb-4">
      Ajouter des informations Moniteur / Monitrice d&apos;auto-école 
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
          <label htmlFor="formateur" className="block text-sm font-medium text-gray-700">
            Formateur
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {predefinedActivities.map((activity,_id) => (
              <button
                type="button"
                key={_id}
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
            placeholder="Enter mot de passe"
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
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
