import "@/app/globals.css";
import WorkerNav from "@/components/menu/WorkerNav";



const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <div className="flex ">
       <WorkerNav/>
        {children}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
