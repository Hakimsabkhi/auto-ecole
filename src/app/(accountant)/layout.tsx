import "@/app/globals.css";
import AccountantNav from "@/components/menu/AccountantNav";
import Subscriptionex from "@/components/subex/Subscriptionex";



const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col-1 ">
       <AccountantNav/>
       <Subscriptionex>
        {children}
         </Subscriptionex>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;