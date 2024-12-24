"use client"

import React, { useEffect, useState } from 'react'
import { CiCreditCard1 } from 'react-icons/ci';
import { FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';


interface Customer {
  
  ref:string;
  cin: number;
  firstname: string;
  lastname: string;
  phone: string;
  address:string
 
}

const page =({ params }: { params: Promise<{ id: string }> }) => {
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);


  const [Data, setData] = useState<Customer>({
    ref:'',
    cin: 0,
    firstname: "",
    lastname: "",
    phone: "",
    address:"",
  });

  useEffect(() => {

    const fetchParams = async () => {
      try {
        const unwrapped = await params; 
        setUnwrappedParams(unwrapped);
      } catch (error) {
        console.error("Error unwrapping params:", error);
      }
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (unwrappedParams?.id) {
      const fetchCustomers = async () => {
        try {
          const response = await fetch(
            `/api/company/customer/getcustomerbyid/${unwrappedParams.id}`
          );
          const { existingCustomer } = await response.json();
          console.log(existingCustomer.dateexcode);
          setData({
            ref:existingCustomer.ref,
            cin: existingCustomer.cin,
            firstname: existingCustomer.firstname,
            lastname: existingCustomer.lastname,
            phone: existingCustomer.phone,
            address:existingCustomer.address
          });
        } catch (error) {
          console.error("Error fetching company data:", error);
        }
      };

      fetchCustomers();
    }
  }, [unwrappedParams?.id]);
  return (
    <div className="rounded overflow-hidden shadow-lg bg-white w-full">
    {/* Card Header */}
   
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden m-8">
  <div className="p-6">

    

    <div className="mt-4 text-center">
      <h2 className="text-xl font-semibold text-gray-800">{Data.firstname} {Data.lastname}</h2>
      <p className="text-sm text-gray-500">{Data.ref}</p>
    </div>


    <div className="mt-6">
      <div className="flex items-center mb-4 text-gray-600">
      <CiCreditCard1 className="w-5 h-5 mr-2" />
        <span className="text-sm">{Data.cin}</span>
      </div>
      <div className="flex items-center mb-4 text-gray-600">
      <FaPhoneAlt className="w-5 h-5 mr-2" />
        <span className="text-sm">{Data.phone}</span>
      </div>
      <div className="flex items-center mb-4 text-gray-600">
       
        <FaMapMarkerAlt  className="w-5 h-5 mr-2" />
        <span className="text-sm">{Data.address}</span>
      </div>
    </div>
  </div>
  
</div>

  </div>
  )
}

export default page