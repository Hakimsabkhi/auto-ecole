import "@/app/globals.css";
import AccountantNav from "@/components/menu/AccountantNav";



const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col-1 ">
       <AccountantNav/>
        {children}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;