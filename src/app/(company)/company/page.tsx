"use client";
import Activitepoppup from "@/components/Company/Activitepoppup";
import { extractHour, formatDatetodate } from "@/lib/timeforma";
import Activite from "@/models/Activite";
import React, { useEffect, useState } from "react";

interface Working {
  _id: string;
  date: string;
  activite: Activite[];
  hstart: string;
  hfinish: string;
}
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

const SchedulePage: React.FC = () => {
  const hours = Array.from({ length: 14 }, (_, i) => `${i + 7}:00`);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openaddactivite, setOpenaddactivite] = useState(false);
  const [workings, setWorkings] = useState<Working[]>([]);
    const [activitiestype, setActivitiestype] = useState<ActiviteType[]>([]);
    const [selectedActivityType, setSelectedActivityType] = useState<string>("");
  
  const [dh, setDh] = useState<{ dates: string; houer: string }>({
    dates: "",
    houer: "",
  });
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedActivityType(e.target.value);
  };
  function close() {
    setOpenaddactivite(false);
  }
 const fetchActivitytype = async () => {
    try {
      const response = await fetch(`/api/company/activity/type/getalltype`);
      if (!response.ok) throw new Error("Failed to fetch activitietype");

      const data = await response.json();
      
      
      setActivitiestype(data);
    } catch (err: unknown) {
      console.error("Error fetching activitiestype:", err);
    }
  };


  const fetchworking = async () => {
    try {
      const response = await fetch("/api/company/working/getworking");

      if (!response.ok) {
        throw new Error("Failed to fetch working");
      }

      const { existworking } = await response.json();
      console.log(existworking)
      setWorkings(existworking); // Update state with fetched data
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    fetchworking();
    fetchActivitytype();
  }, []);

  // Generate columns based on the current date
  const columns = Array.from({ length: 3 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    const optionss: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return {
      label: date.toLocaleDateString("fr-FR", options),
      day: date.toLocaleDateString("en-FR", { weekday: "long" }),
      date: date.toLocaleDateString("fr-FR", optionss),
    };
  });

  // Format the header to show the main selected date
  const headerDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Handlers for navigation
  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  function handleaddactivite(str: string, hstr: string) {
    console.log(str, hstr);
    setDh({
      dates: str,
      houer: hstr,
    });
    setOpenaddactivite(true);
  }

  return (
    <div className="h-screen flex flex-col items-center p-4 w-full">
      <h1 className="text-3xl font-bold ">Agenda de travail</h1>
<div className="flex items-center justify-center space-x-4 p-8 ">
       <label
              
                className="flex items-center  space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="option"
                  value=''
                  defaultChecked
                 onChange={handleRadioChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-gray-700">All</span>
              </label>
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
      {/* Header */}
      <div className="flex justify-between items-center max-w-4xl mb-4 w-full">
        <button
          onClick={handlePreviousDay}
          className="text-gray-700 px-4 py-2 border rounded hover:bg-gray-200"
        >
          {"<"}
        </button>
        <h1 className="text-lg font-bold text-gray-800">
          {headerDate.toUpperCase()}
        </h1>
        <button
          onClick={handleNextDay}
          className="text-gray-700 px-4 py-2 border rounded hover:bg-gray-200"
        >
          {">"}
        </button>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-[80px_repeat(3,_1fr)] gap-2 w-full max-w-4xl overflow-y-auto">
        {/* Hours Column */}
        <div className="bg-white p-2 text-center font-bold">Heures</div>
        {columns.map((col, i) => (
          <div
            key={i}
            className={`bg-gray-300 p-2 text-center font-bold  ${
              i === 1 ? "bg-gray-400" : ""
            }`}
          >
            {col.label}
          </div>
        ))}

        {/* Hours and Cells */}
        {hours.map((hour, i) => (
          <React.Fragment key={i}>
            <div className="bg-white p-2 text-center">{hour}</div>
            {columns.map((col, j) => {
               
              // Check if there's a matching working activity for the specific date and hour
             // Check if there's a matching working activity for the specific date and hour
const matchingWorking = workings.find(
  (work) =>
    formatDatetodate(work.date).date === col.date &&
    extractHour(work.hstart) === hour &&
    (selectedActivityType
      ? work.activite.some((activite) => activite.activites._id === selectedActivityType)
      : true)  // If no selectedActivityType, always return true (no filtering by activity type)
);

              return (
                <div
                  key={j}
                  className={`border p-2 text-center`}
                >
                  {matchingWorking ? (
                    <div className="overflow-y-scroll h-20">
                      <div className="text-sm border-b-2 ">
                        
                        {matchingWorking.activite?.map((Activite, index) => (
                          <div key={index} className="grid grid-cols-2  bg-gray-500 p-2 border-b-2 gap-2">
                           <div className="flex flex-col justify-start items-start">
                           <span> A: {Activite.activites.name}</span>
                           <span> H.D: {matchingWorking.hstart}</span>
                           <span> H.F: {matchingWorking.hfinish}</span>
                           </div>
                           <div className="flex flex-col  items-start justify-center">
                           <span>C: {Activite.customer.firstname}<br/>
                                    {Activite.customer.lastname}</span>
                            <span>F: {Activite.worker.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                      className="w-[100%] p-2 border border-gray-500"
                      type="button"
                      onClick={() => handleaddactivite(col.date, hour)}
                    >
                      +
                    </button>
                    </div>
                  ) : (
                    <button
                      className="w-[100%] p-2 border border-gray-500"
                      type="button"
                      onClick={() => handleaddactivite(col.date, hour)}
                    >
                      +
                    </button>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Popup for adding activity */}
      {openaddactivite && <Activitepoppup close={close} dh={dh} fetchworking={fetchworking}/>}
    </div>
  );
};

export default SchedulePage;
