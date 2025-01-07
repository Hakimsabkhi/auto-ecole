import React from 'react'

interface dealings {
  _id: string;
  date: string;
  activite: task;
  hstart: string;
  hfinish: string;
  
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
  cin:string
}

interface Worker {
  _id: string;
  name: string;
}

interface Activite {
  _id: string;
  name: string;
}

interface PresentpopupProps {
 
  close: () => void;
  fetchworking:()=>void;
  selectdealings?:dealings; 
}
const Presentpopup  : React.FC<PresentpopupProps> =({close,selectdealings ,fetchworking})=>{
  async function handleYesNo(id: string, button: string) {
    try {
      const response = await fetch(`/api/worker/dealings/updatestatus/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ button }),  // Wrap button inside an object (if button is supposed to be part of a structured request)
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update dealings with id: ${id}`);
      }
      fetchworking();
      close();
 
  
    } catch (error) {
      console.error("Error updating dealings:", error);
      throw error;  // Optionally re-throw the error if you want it to propagate further
    }
  }
  
  return (
    <div className="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover backdrop-filter backdrop-brightness-75">
    <div className="absolute opacity-80 inset-0 z-0"></div>
     <div className="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
       {/* content */}
       <div className="flex  justify-center items-center">
       <h1 className="font-bold text-2xl">Présent</h1>
       </div>
       <div className="grid grid-flow-row">
       <span>CIN : {selectdealings?.activite.customer.cin}</span>
       <span> Nom : {selectdealings?.activite.customer.firstname}</span>
       <span> Prenom : {selectdealings?.activite.customer.lastname}</span>
       <span> Telephone: {selectdealings?.activite.customer.phone}</span>
       </div>
       <div className="flex flex-col-1 justify-between items-center mt-2 text-white">
       <div >
       <button className="bg-gray-500 p-2 rounded-lg hover:bg-gray-400" type='button'  onClick={close}>Annule</button>
       </div>
       {selectdealings &&   <div className="flex flex-col-1 gap-2">  
    
       <button className="bg-gray-700 hover:bg-green-600 p-2 rounded-lg" onClick={()=>handleYesNo(selectdealings._id,"yes")}>Oui</button> 
       <button className="bg-gray-600 hover:bg-red-600 p-2 rounded-lg" onClick={()=>handleYesNo(selectdealings._id,"no")}>Non</button>   
      
       </div> }
       </div> 
     </div>
</div>
  )
}

export default Presentpopup