import { formatTime } from "@/lib/timeforma";
import React, { useEffect, useState } from "react";

interface Activite {
  _id: string;
  ref: string;
  customer: Customer;
  worker: Worker;
  activites: ActiviteType;
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

interface ActiviteType {
  _id: string;
  name: string;
}

interface ActivitepoppupProp {
  close: () => void;
  fetchworking:()=>void;
  dh: {
    dates: string;
    houer: string;
  };
}

const Activitepoppup: React.FC<ActivitepoppupProp> = ({ close, dh ,fetchworking}) => {
  const [activitiess, setActivitiess] = useState<Activite[]>([]);
  const [activities, setActivities] = useState<Activite[]>([]);
  const [newActivity, setNewActivity] = useState<Activite | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredActivities, setFilteredActivities] = useState<Activite[]>([]);
  const [open, setOpen] = useState(false);
  const [activitiestype, setActivitiestype] = useState<ActiviteType[]>([]);
  const [selectedActivityType, setSelectedActivityType] = useState<string>("");
  const handleSearchActivite = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);

    const filtered = activitiess.filter(
      (activity) =>
        activity.ref.toLowerCase().includes(query) ||
        activity.customer.lastname.toLowerCase().includes(query) ||
        activity.customer.firstname.toLowerCase().includes(query)
    );
    setFilteredActivities(filtered);
    setOpen(true);
  };

  const handleActiviteSelect = (activity: Activite) => {
    const str = `${activity.ref} ${activity.customer.firstname} ${activity.customer.lastname}`;
    setSearchTerm(str);
    setNewActivity(activity);
    setOpen(false);
  };

  const removeActivity = (index: number) => {
    setActivities((prev) => prev.filter((_, i) => i !== index));
  };

  const addActivity = () => {
    if (
      newActivity &&
      !activities.some((activity) => activity._id === newActivity._id)
    ) {
      setActivities((prev) => [...prev, newActivity]);
      setNewActivity(null);
    }
  };

  const fetchActivity = async (id: string) => {
    try {
      const response = await fetch(
        `/api/company/activity/getactivitybystudy/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch activities");

      const { existingaActivite } = await response.json();
      setActivitiess(existingaActivite);
    } catch (err: unknown) {
      console.error("Error fetching activities:", err);
    }
  };

  const fetchActivitytype = async () => {
    try {
      const response = await fetch(`/api/company/activity/type/getalltype`);
      if (!response.ok) throw new Error("Failed to fetch activitietype");

      const data = await response.json();
      console.log(data);
      setActivitiestype(data);
    } catch (err: unknown) {
      console.error("Error fetching activitiestype:", err);
    }
  };

  useEffect(() => {
    fetchActivitytype();
  
  }, []);
  useEffect(() => {
    if (selectedActivityType) {
      fetchActivity(selectedActivityType);
    }
  }, [selectedActivityType]);
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedActivityType(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Logic to submit form data
    const formData = {
      activities,
      timeStart: (e.target as HTMLFormElement).startTime.value,
      timeEnd: (e.target as HTMLFormElement).endTime.value,
      date: dh.dates,
    };

    console.log("Form submitted:", formData);

    try {
      const response = await fetch("/api/company/working/postworking", {
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
        throw new Error("Failed to submit activities.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error during submission:", err.message);
        alert("Submission failed. Please try again.");
      }
    }
    // Perform API call or other submission logic here
  };

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
                className="flex items-center  space-x-2 cursor-pointer"
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
              {open && (
                <ul className="absolute top-32 mt-1 w-[80%] bg-white rounded-md shadow-md max-h-60 overflow-auto">
                  {filteredActivities.map((activity) => (
                    <li
                      key={activity._id}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleActiviteSelect(activity)}
                    >
                      {activity.ref} {activity.activites.name}{" "}
                      {activity.customer.firstname} {activity.customer.lastname}
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                className="bg-gray-700 text-white hover:bg-gray-600 p-2 rounded-md"
                onClick={addActivity}
                
              >
                Add
              </button>
            </div>

            <div className="mb-4 overflow-y-auto h-48 border border-gray-300 rounded-lg">
              <table className="w-full border-collapse">
                <tbody>
                  {activities.map((activity, index) => (
                    <tr
                      key={index}
                      className="bg-purple-100 text-purple-900 text-sm border-b-2"
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
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeActivity(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="start-time"
                  className="block text-gray-600 mb-1"
                >
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
