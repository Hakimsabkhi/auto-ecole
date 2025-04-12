import "@/app/globals.css";
import WorkerNav from "@/components/menu/WorkerNav";
import Subscriptionex from "@/components/subex/Subscriptionex";



const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col-1 ">
       <WorkerNav/>
       <Subscriptionex>
        {children}
        </Subscriptionex>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
