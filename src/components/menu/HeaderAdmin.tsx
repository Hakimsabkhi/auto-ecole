// components/menu/Header.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";





import LogoComponentAdmin from "@/components/menu/LogoComponentAdmin";
import UserMenuadmin from "@/components/menu/UserMenuadmin";

const HeaderAdmin = async () => {
  // Fetch the session on the server-side
  const session = await getServerSession(authOptions);

  return (
    <>
     
      <div className="w-full h-[80px] bg-white flex justify-center items-center max-lg:justify-around gap-4 border-y border-gray-600 ">
        <div className="w-[90%] flex justify-between items-center max-lg:justify-around gap-4">
          <LogoComponentAdmin />
          <div className="flex">
        
          
            <UserMenuadmin session={session} />
          </div>
        </div>
      </div>
   
    </>
  );
};

export default HeaderAdmin;
