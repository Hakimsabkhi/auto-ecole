"use client";
import AdddeletPopup from "@/components/popup/AdddeletPopup";
import PopupDelete from "@/components/popup/DeletePopup";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";

interface Worker {
  name: string;
  formateur: string;
}

interface Customer {
  _id: string;
  cin: number;
  firstname: string;
  lastname: string;
  phone: string;
  activities: string[];
  total: number;
  avance: number;
  worker: Worker[];
  numbheurestotal: number;
  numbheureseffectuer: number;
  dateexcode: string;
  dateexconduit: string;
  dateexpark: string;
  createdAt: string;
}
interface dataselect{
 id:string;
  val:string;
  ref:string;

}
const CustomerTable: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpenadd, setIsPopupOpenadd] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [selectvalref,setSelectvalref]=useState<dataselect>( {
    id:"",
    val: "",
    ref: ""
  })
  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/company/customer/getallcustomer");

      if (!response.ok) {
        throw new Error("Failed to fetch workers");
      }

      const data = await response.json();
      setCustomers(data); // Update state with fetched data
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };
  const handleChange=(id:string,val:string,ref:string)=>{
    setSelectvalref({
      id:id,
      val: val,
      ref: ref,
    });
    setIsPopupOpenadd(true)
  }
  const closeopen=()=>{
    setIsPopupOpenadd(false)
  }
  const formatDateexam = (date: string | Date | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };
  // Fetch workers on initial render
  useEffect(() => {
    fetchCustomers();
  }, []);
  const handleDeleteClick = (customer: Customer) => {
    setSelected(customer);
    setIsPopupOpen(true);
  };
  function formatDate(dateStr: string) {
    const date = new Date(dateStr); // Use dateStr as input for creating a new Date object
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour format
    });
  }
  const deletecustomer = async (workerId: string) => {
    try {
      const response = await fetch(
        `/api/company/customer/deletecustomer/${workerId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }
      fetchCustomers();
      console.log("Deleted successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`Failed to delete customer: ${err.message}`);
      } else {
        console.error("Failed to delete customer: Unknown error");
      }
    } finally {
      handleClosePopup();
    }
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelected(null);
  };
  
    const handleupdate = async (id:string, val:string,ref:string,input:string) => {
      
  
      try {
        const formData = {
          val: val,
          ref: ref,
          input: input,
        };
        const response = await fetch(`/api/company/customer/updatehoures/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update customer");
        }
        fetchCustomers();
        setIsPopupOpen(false);
        setSelectvalref(
          {
            id:'',
            val:'',
            ref:''

          }
        )
       
      } catch (error) {
        console.error("Error update customer:", error);
      }
    };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Customer Table</h1>
      <div className="flex w-full justify-end pb-4">
        <Link
          href={"/company/customer/addcustomer"}
          className="bg-gray-800 p-4 rounded-md text-white"
        >
          Create Customer
        </Link>
      </div>
      <table className="w-full border-collapse border border-gray-200 uppercase">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              CIN
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Full Name
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Phone
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Activities
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Date Registration
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Total
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Avance
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Workers
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Hours Total
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Hours Worked
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Date examin
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id} className="border-t hover:bg-gray-50">
              <td className="py-2 px-4">{customer.cin}</td>
              <td className="py-2 px-4">
                {customer.firstname} {customer.lastname}
              </td>
              <td className="py-2 px-4">{customer.phone}</td>
              <td className="py-2 px-4">{customer.activities.join(", ")}</td>
              <td className="py-2 px-4">{formatDate(customer.createdAt)}</td>
              <td className="py-2 px-4">{customer.total}DT</td>
              <td className="py-2 px-4">{customer.avance}DT</td>
              <td className="py-2 px-4">
                {customer.worker.map((w) => (
                  <div key={w.name}>
                    <span>
                      {w.name}/{w.formateur}
                    </span>
                  </div>
                ))}
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleChange(customer._id,"total", "+")}
                  className="ml-2 p-1 bg-green-500 text-white rounded"
                >
                  +
                </button>
                {customer.numbheurestotal}H
                <button
                  onClick={() => handleChange(customer._id,"total", "-")}
                  className="ml-2 p-1 bg-red-500 text-white rounded"
                >
                  -
                </button>
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleChange(customer._id,"effectuer", "+")}
                  className="ml-2 p-1 bg-green-500 text-white rounded"
                >
                  +
                </button>
                {customer.numbheureseffectuer}H
                <button
                  onClick={() => handleChange(customer._id,"effectuer", "-")}
                  className="ml-2 p-1 bg-red-500 text-white rounded"
                >
                  -
                </button>
              </td>

              <td className="py-2 px-4">
                <div className="grid grid-flow-row">
                  <span className="w-[150%]">
                    Code:{formatDateexam(customer.dateexcode)}
                  </span>
                  <span className="w-[150%]">
                    Conduit:{formatDateexam(customer.dateexconduit)}
                  </span>
                  <span className="w-[150%]">
                    Park:{formatDateexam(customer.dateexpark)}
                  </span>
                </div>
              </td>
              <td className="py-2 px-4">
                <div className="p-2 flex gap-2">
                  <Link
                    href={`/company/customer/${customer._id}`}
                    className="bg-green-600 hover:bg-green-500 p-4 rounded-md text-white"
                  >
                    <CiEdit size={25} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(customer)}
                    disabled={selected?._id === customer._id}
                    className="bg-red-600 hover:bg-red-500 p-4 rounded-md text-white uppercase"
                  >
                    {selected?._id === customer._id ? (
                      "Processing..."
                    ) : (
                      <RiDeleteBin5Line size={25} />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isPopupOpen && selected && (
        <PopupDelete
          handleClosePopup={handleClosePopup}
          Delete={deletecustomer}
          id={selected._id}
          name={selected.firstname}
        />
      )}
    {isPopupOpenadd && <AdddeletPopup
    selectvalref={selectvalref}
    handleClosePopup={closeopen}
    handleupdate={handleupdate}
        />}
    </div>
  );
};

export default CustomerTable;
