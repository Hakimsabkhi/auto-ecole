"use client";

import Presentpopup from "@/components/popup/Presentpopup";
import { extractHour, formatDatetodate } from "@/lib/timeforma";
import Activite from "@/models/Task";
import React, { useEffect, useState } from "react";


interface dealings {
  _id: string;
  date: string;
  activite: task;
  hstart: string;
  hfinish: string;
  status:boolean
}

interface task {
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
  phone:string;
  cin:string;
}

interface Worker {
  _id: string;
  name: string;
}

interface Activite {
  _id: string;
  name: string;
}

const SchedulePage: React.FC = () => {
  const hours = Array.from({ length: 14 }, (_, i) => `${i + 7}:00`);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workings, setWorkings] = useState<dealings[]>([]);
  const [openaddactivite, setOpenaddactivite] = useState(false);
  const [selectdealings,setSelectdealings]=useState<dealings>();
  const close = () => {
    setOpenaddactivite(false);
  };
  function handleaddactivite(workering:dealings) {
    setSelectdealings(workering);
    setOpenaddactivite(true);
  }



  const fetchworking = async () => {
    try {
      const response = await fetch("/api/worker/dealings/getdealings");

      if (!response.ok) {
        throw new Error("Failed to fetch dealings");
      }

      const { existworking } = await response.json();
      setWorkings(existworking); // Update state with fetched data
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };
   

  useEffect(() => {
    fetchworking();
   
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

                 
  

  return (
    <div className="h-screen flex flex-col items-center p-4 w-full">
      <h1 className="text-3xl font-bold ">Agenda de travail</h1>

     
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
              // Find all matching working activities for the specific date and hour
              const matchingWorkings = workings.filter(
                (work) =>
                  formatDatetodate(work.date).date === col.date &&  
                  extractHour(work.hstart) === hour 
                  
              );

             

              return (
                <div key={j} className="border p-2 text-center">
              
              {matchingWorkings.length>0 ? (
                <>
                 
                      <div className="overflow-x-scroll overflow-y-hidden h-24 w-60">
                        <div className="text-sm border-b-2 grid grid-flow-col ">
                          {matchingWorkings.map((matchingWork, idx) => (
                            <div key={idx} className={`relative grid grid-cols-2 p-2 border-l-2 w-60 ${
                              matchingWork?.status === true ? "bg-green-500" :
                              matchingWork?.status === false ? "bg-red-500" :
                              "bg-gray-500"
                            }`}
                             onClick={()=>handleaddactivite(matchingWork)}>
                              <div className="flex flex-col items-start ">
                                <span>A: {matchingWork.activite.activites.name}</span>
                                <span>H.D: {matchingWork.hstart}</span>
                                <span>H.F: {matchingWork.hfinish}</span>
                              </div>
                              <div className="flex flex-col items-start ">
                                <span>
                                  C: {matchingWork.activite.customer.firstname}
                                  <br />
                                  {matchingWork.activite.customer.lastname}
                                </span>
                                <span>TEL: {matchingWork.activite.customer.phone}</span>
                              </div>
                           
                              
                            </div>
                          ))}
                           
                        </div>
                      </div>
                    
                      </>
           ) : (
            <div
              className="w-[100%] p-3 border border-gray-500"
             
            
            >
              
            </div>
          )}
                  
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      {openaddactivite &&  <Presentpopup close={close} selectdealings={selectdealings} fetchworking={fetchworking}/>}

    </div>
  );
};

export default SchedulePage;
