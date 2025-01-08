import React from 'react'

const PaymentPopupAccount = () => {
  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-500 opacity-50"></div>
      <div className="flex items-center justify-center bg-gray-300 relative z-10 shadow-2xl rounded-3xl">
        <div className="w-[500px] p-6 rounded-lg">
               <h1 className="text-xl font-bold text-center">Ajouter un paiement</h1>
       
              <div className="flex flex-col justify-center items-center p-10">
              <input className="border p-2 w-full text-center "/>
              <div className="flex flex-col-1 pt-6 gap-3 justify-center items-center text-white">
              <button className="bg-gray-900 hover:bg-gray-800 px-5 py-2  rounded-lg ">Ajouter</button><button className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg ">Annuler</button>
              </div>
              </div>
          </div>
       </div>
      </div>
  )
}

export default PaymentPopupAccount