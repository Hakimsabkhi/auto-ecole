import "@/app/globals.css";
import CompanyNav from "@/components/menu/CompanyNav";
import Subscriptionex from "@/components/subex/Subscriptionex";



// Load Poppins font with the desired weights and subsets


const RootLayout = async ({ children }: { children: React.ReactNode }) => {

  return (
    <html lang="en">
      <body>
        <div className="flex flex-col-1 ">
        <CompanyNav />
        <Subscriptionex>
        {children}
        </Subscriptionex>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
