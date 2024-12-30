"use client"
import React, { useState } from 'react';

const SchedulePage: React.FC = () => {
  const hours = Array.from({ length: 14 }, (_, i) => `${i + 7}:00`);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate columns based on the current date
  const columns = Array.from({ length: 3 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
    return {
      label: date.toLocaleDateString('fr-FR', options), // Example: "Monday, 12/11/2024"
      day: date.toLocaleDateString('en-FR', { weekday: 'long' }), // Example: "Monday"
    };
  });

  // Format the header to show the main selected date
  const headerDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
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
      {/* Header */}
      <div className="flex justify-between items-center max-w-4xl mb-4 w-full">
        <button
          onClick={handlePreviousDay}
          className="text-gray-700 px-4 py-2 border rounded hover:bg-gray-200"
        >
          {'<'}
        </button>
        <h1 className="text-lg font-bold text-gray-800">{headerDate.toUpperCase()}</h1>
        <button
          onClick={handleNextDay}
          className="text-gray-700 px-4 py-2 border rounded hover:bg-gray-200"
        >
          {'>'}
        </button>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-[80px_repeat(3,_1fr)] gap-2 w-full max-w-4xl">
        {/* Hours Column */}
        <div className="bg-white p-2 text-center font-bold">Heures</div>
        {columns.map((col, i) => (
          <div key={i} className={`bg-gray-300 p-2 text-center font-bold  ${i === 1 ? 'bg-gray-400' : ''}`}>
            {col.label}
          </div>
        ))}

        {/* Hours and Cells */}
        {hours.map((hour, i) => (
          <React.Fragment key={i}>
            <div className="bg-white p-2 text-center">{hour}</div>
            {columns.map((col, j) => (
              <div
                key={j}
                className={`border p-2 text-center  ${
                  col.day === 'Monday' && hour === '8:00' ? 'bg-gray-500 text-white' : 'hover:bg-gray-200'
                }`}
              >
                {col.day === 'Monday' && hour === '8:00' ? (
                  <div className=' overflow-y-scroll h-20 ' >
                  <div className="text-sm border-b-2">
                    <p>A: code</p>
                    <p>H.D: 8:30</p>
                    <p>C:msb</p>
                    <p>C:becher</p>
            
                  </div>
               
                <div className="text-sm flex items-center bg-white justify-center text-black">  +</div>
                </div>
                ) : (
                  '+'
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <div className="z-50 fixed inset-0 flex items-center justify-center">
  {/* Background overlay */}
  <div className="absolute inset-0 bg-slate-500 opacity-50"></div>

  {/* Centered content */}
  <div className="relative bg-white w-[30%] h-[60%] rounded-3xl shadow-lg z-10">
    {/* Content goes here */}
    <h1 className='text-2xl font-bold '>Activite</h1>
  </div>
</div>

    </div>
  );
};

export default SchedulePage;
