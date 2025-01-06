import { formatTime } from "@/lib/timeforma";
import React, { useEffect, useState } from "react";

interface Task {
  _id: string;
  ref: string;
  customer: Customer;
  worker: Worker;
  activites: Activite;
  mt: string;
  mp: string;
  nht: string;
  nhe: string;
  dateexam: Date;
  status: string;
}

interface Customer {
  _id: string;
  firstname: string;
  lastname: string;
}

interface Worker {
  _id: string;
  name: string;
}

interface Activite {
  _id: string;
  name: string;
}

interface ActivitepoppupProp {
  close: () => void;
  fetchworking: () => void;
  dh: {
    dates: string;
    houer: string;
  };
}

const Activitepoppup: React.FC<ActivitepoppupProp> = ({ close, dh, fetchworking }) => {
  const [activitiess, setActivitiess] = useState<Task[]>([]); // All activities
  const [activities, setActivities] = useState<Task[]>([]);   // Filtered activities (as an array)
  const [searchTerm, setSearchTerm] = useState("");  // For search term
  const [selectedActivityType, setSelectedActivityType] = useState<string>("");

  const [activitiestype, setActivitiestype] = useState<Activite[]>([]);

  // Fetch all activities for a specific activity type
  const fetchActivity = async (id: string) => {
    try {
      const response = await fetch(`/api/company/task/gettaskbystudy/${id}`);
      if (!response.ok) throw new Error("Failed to fetch task");

      const { existingaActivite } = await response.json();
      setActivitiess(existingaActivite);
    } catch (err: unknown) {
      console.error("Error fetching task:", err);
    }
  };

  // Fetch all activity types
  const fetchActivitytype = async () => {
    try {
      const response = await fetch(`/api/company/task/activite/getallactivite`);
      if (!response.ok) throw new Error("Failed to fetch activite");

      const data = await response.json();
      setActivitiestype(data);
    } catch (err: unknown) {
      console.error("Error fetching activite :", err);
    }
  };

  // Search activities based on search term
  const handleSearchActivite = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);

    const filtered = activitiess.filter(
      (activity) =>
        activity.ref.toLowerCase().includes(query) ||
        activity.customer.lastname.toLowerCase().includes(query) ||
        activity.customer.firstname.toLowerCase().includes(query)
    );
    setActivities(filtered);
  };

  // Handle activity type selection
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const activityType = e.target.value;
    setSelectedActivityType(activityType);
    fetchActivity(activityType); // Fetch activities based on selected type
  };

  // Handle selecting an activity
  const handleActiviteSelect = (activity: Task) => {
    const str = `${activity.ref} ${activity.customer.firstname} ${activity.customer.lastname}`;
    setSearchTerm(str);
    setActivities([activity]); // Show only the selected activity as an array
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!activities.length) {
      alert("Please select an activity.");
      return;
    }

    const formData = {
      activities: activities[0], // Only one activity is selected
      timeStart: (e.target as HTMLFormElement).startTime.value,
      timeEnd: (e.target as HTMLFormElement).endTime.value,
      date: dh.dates,
    };

    try {
      const response = await fetch("/api/company/dealings/postdealings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchworking();
        close(); // Close the popup
      } else {
        throw new Error("Failed to submit dealings.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error during submission:", err.message);
        alert("Submission failed. Please try again.");
      }
    }
  };

  // Use effect to fetch activity types and activities when the type changes
  useEffect(() => {
    fetchActivitytype();
  }, []);

  useEffect(() => {
    if (selectedActivityType) {
      fetchActivity(selectedActivityType);
    }
  }, [selectedActivityType]);

  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-500 opacity-50"></div>
      <div className="flex items-center justify-center bg-white relative z-10 shadow-2xl rounded-3xl">
        <div className="w-[500px] p-6 rounded-lg">
          <h1 className="text-xl font-bold text-center">Activité</h1>
          <div className="flex items-center justify-center space-x-4 p-2">
            {activitiestype.map((option) => (
              <label
                key={option._id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="option"
                  value={option._id}
                  onChange={handleRadioChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-gray-700">{option.name}</span>
              </label>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-bold text-center mb-4">{dh.dates}</h2>

            <div className="mb-4 flex gap-2">
              <input
                type="text"
                placeholder="Search or add activity"
                className="w-full border border-gray-300 rounded-md p-2"
                disabled={!selectedActivityType}
                value={searchTerm}
                onChange={handleSearchActivite}
              />
            </div>

            <div className="mb-4 overflow-y-auto h-48 border border-gray-300 rounded-lg">
              <table className="w-full border-collapse">
                <tbody>
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <tr
                        key={activity._id}
                        className="bg-purple-100 text-purple-900 text-sm border-b-2"
                        onClick={() => handleActiviteSelect(activity)}
                      >
                        <td className="p-2 flex items-center gap-3 justify-between">
                          <span className="border-r-2 p-2">
                            RefActivite: <br />
                            {activity.ref}
                          </span>
                          <span>
                            A: {activity.activites.name} / C :{" "}
                            {activity.customer.firstname}{" "}
                            {activity.customer.lastname} <br />/ F :{" "}
                            {activity.worker.name}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="text-center p-4">
                        No activities found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-time" className="block text-gray-600 mb-1">
                  Heures de depart
                </label>
                <input
                  type="time"
                  id="startTime"
                  defaultValue={formatTime(dh.houer)}
                  name="startTime"
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="HH:MM"
                />
              </div>
              <div>
                <label htmlFor="end-time" className="block text-gray-600 mb-1">
                  Heures Fin
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="HH:MM"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-2 justify-end text-white">
              <button
                type="button"
                onClick={close}
                className="bg-gray-400 hover:bg-gray-300 p-2 rounded-md"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-md"
              >
                Confirmer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Activitepoppup;
