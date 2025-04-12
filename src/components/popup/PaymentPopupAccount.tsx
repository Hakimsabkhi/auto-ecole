import React, { useState } from "react";
interface PaymentPopupAccountProps {
  closepay: () => void;
  selectid:string;
  fetchActivities:()=>void;
}
const PaymentPopupAccount: React.FC<PaymentPopupAccountProps> = ({
  closepay,
  selectid,
  fetchActivities
}) => {
  const [paymentValue, setPaymentValue] = useState<string>("");

  const addpayment = async () => {
    if (paymentValue) {
      try {
        // Create the formData object (you can add additional fields as needed)
        const formData = {
          amount: paymentValue,  // Example of a field you might want to include
          accountId: selectid,   // Pass the selected account id
        };
  
        const response = await fetch('/api/accountant/task/postamount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to submit activite form');
        }
  
        closepay();  // Close the popup
        setPaymentValue("");
        fetchActivities();
      } catch (error) {
        console.error("Error submitting payment:", error);
        alert("There was an error processing the payment. Please try again.");
      }
    } else {
      alert("Please enter a valid payment value.");
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addpayment();
    }
  };
  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-500 opacity-50"></div>
      <div className="flex items-center justify-center bg-gray-300 relative z-10 shadow-2xl rounded-3xl">
        <div className="w-[500px] p-6 rounded-lg">
          <h1 className="text-xl font-bold text-center">Ajouter un paiement</h1>

          <div className="flex flex-col justify-center items-center p-10">
            <input 
            
              placeholder="Enter Montant"
             value={paymentValue}
             onChange={(e) => setPaymentValue(e.target.value)}
             onKeyDown={handleKeyDown} 
            className="border p-2 w-full text-center rounded-md " />
            <div className="flex flex-col-1 pt-6 gap-3 justify-center items-center text-white">
              <button 
               type="button"
               onClick={addpayment}
              className="bg-gray-900 hover:bg-gray-800 px-5 py-2  rounded-lg ">
                Ajouter
              </button>
              <button 
              type="button"
              onClick={closepay}
              className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg ">
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopupAccount;
