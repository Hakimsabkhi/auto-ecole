import React from 'react';

const SchedulePage: React.FC = () => {
  const hours = Array.from({ length: 14 }, (_, i) => `${i + 6}:00`);
  const columns = ['Monday 12/11/2024', 'Monday 12/11/2024', 'Monday 12/11/2024'];

  return (
    <div className="h-screen  flex flex-col items-center p-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-center max-w-4xl mb-4">
        <button className="text-gray-700 px-4 py-2 border rounded hover:bg-gray-200">{'<'}</button>
        <h1 className="text-lg font-bold text-gray-800">MONDAY 12/11/2024</h1>
        <button className="text-gray-700 px-4 py-2 border rounded hover:bg-gray-200">{'>'}</button>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-[80px_repeat(3,_1fr)] gap-2 w-full max-w-4xl">
        {/* Hours Column */}
        <div className="bg-white p-2 text-center font-bold">Heures</div>
        {columns.map((col, i) => (
          <div key={i} className={`bg-gray-300 p-2 text-center font-bold ${i === 1 ? 'bg-gray-400' : ''}`}>
            {col}
          </div>
        ))}

        {/* Hours and Cells */}
        {hours.map((hour, i) => (
          <React.Fragment key={i}>
            <div className="bg-white p-2 text-center">{hour}</div>
            {columns.map((_, j) => (
              <div
                key={j}
                className={`border p-2 text-center ${
                  i === 2 && j === 0 ? 'bg-gray-500 text-white' : 'hover:bg-gray-200'
                }`}
              >
                {i === 2 && j === 0 ? (
                  <div className="text-sm">
                    <p>4 Guests</p>
                    <p>2 Tables</p>
                    <p>Booked</p>
                  </div>
                ) : (
                  '+'
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SchedulePage;
