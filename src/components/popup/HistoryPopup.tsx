import { formatDates } from '@/lib/timeforma';
import React, { useEffect, useState } from 'react'
import { LuPenLine, LuTrash2 } from 'react-icons/lu'
interface Historypay{
    _id:string;
    amount:number;
    createdAt:string
    
}
interface HistoryPopupProps{
  closeHistory:()=>void; 
  selectid:string;
  fetchActivities:()=>void;
}

const HistoryPopup : React.FC<HistoryPopupProps> = ({
  closeHistory,
  selectid,
fetchActivities
})=> {
  const[historypay,setHistorypay]=useState<Historypay[]>([]);
  const [pendingDeleteId, setPendingDeleteId] = useState<string[]>([]); 
  const [editingItemId, setEditingItemId] = useState<string>('');
  const [buttonColor, setButtonColor] = useState("bg-gray-400");
  const [isDisabled, setIsDisabled] = useState(true); // Track disabled state
  async function fatchhistory(){
    try {
      const response = await fetch(
        `/api/accountant/task/gethistory/${selectid}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch workers");
      }
  
      const { existingaHistorypay } = await response.json();
      setHistorypay(existingaHistorypay); 
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  }
  const handleEdit = (id:string) => {
    if (editingItemId === id) {
      setEditingItemId(""); // If the same item is clicked, disable editing
    } else {
      setEditingItemId(id); // Enable editing for the clicked item
    }
    setIsDisabled(false);  // Disable the button after clicking
    setButtonColor("bg-gray-900"); 
  };
  useEffect(() => {
    fatchhistory();  // Corrected function name
  }, []);
  const totalAmount = historypay.reduce((total, item) => total + item.amount, 0);
  
  const handleAmountChange = (id: string, newAmount: number) => {
    setHistorypay(prevState =>
      prevState.map(item =>
        item._id === id ? { ...item, amount: newAmount } : item
      )
    );
  };

  // Handle delete
  const handleDelete = (id: string) => {
    setHistorypay(prevState => prevState.filter(item => item._id !== id));
    setIsDisabled(false);  // Disable the button after clicking
    setButtonColor("bg-gray-900"); 
    setPendingDeleteId(prevIds => [...prevIds, id]);
  };
  const handleupdate = async (total: number) => {
  
    
    try {
      const response = await fetch(`/api/accountant/task/updateamount/${selectid}`, {
        method: 'PUT',  // or PATCH, depending on your server's requirement
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          total,
          historypay,
          pendingDeleteId
          
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update task amount");
      }
      fetchActivities();
      closeHistory();
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };
  
  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center">
    <div className="absolute inset-0 bg-slate-500 opacity-50"></div>
    <div className="flex items-center justify-center bg-gray-300 relative z-10 shadow-2xl rounded-3xl">
      <div className="w-[500px] p-6 rounded-lg">
             <h1 className="text-xl font-bold text-center">Historique de paiement</h1>
     
            <div className="flex flex-col justify-center items-center p-10">
            {historypay.map((item) => (     <div  key={item._id}  className="flex flex-row gap-4 justify-center items-center pt-2">
              <input className="border p-2  text-center w-1/4 rounded-md"
              type="text"
              value={item.amount}
              onChange={(e) => handleAmountChange(item._id, Number(e.target.value))}
              disabled={editingItemId !== item._id}
              />
              <label >{formatDates(item.createdAt)}</label>
              <button className="bg-gray-900 p-2 text-white rounded-md "
              type='button'
              onClick={() => handleEdit(item._id)}
              ><LuPenLine size={20}  /></button>
              <button 
              type='button'
              onClick={() => handleDelete(item._id)}
              className="bg-gray-900 p-2 text-white  rounded-md"><LuTrash2 size={20} /></button>

              </div> ))}
             <hr className="bg-white w-full mt-2"/>
             <div className="flex flex-row gap-4 justify-center items-center mt-5">
              <label >Total</label>
              <input 
              type="text"
              value={totalAmount}
              className="border px-6 py-2 text-center w-1/3 rounded-md"
              disabled
              />
          
              </div>
           
            <div className="flex flex-col-1 pt-6 gap-3 justify-center items-center text-white">
            <button 
            type='button'
            disabled={isDisabled}
            onClick={()=>handleupdate(totalAmount)}
          
           className= {`${buttonColor} ${!isDisabled ? 'hover:bg-gray-800' : ''} px-5 py-2  rounded-lg`}>Confirmer</button>
            <button 
            type='button'
            onClick={()=>closeHistory()}
            className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg ">Annuler</button>
            </div>
            </div>
        </div>
     </div>
    </div>
  )
}

export default HistoryPopup