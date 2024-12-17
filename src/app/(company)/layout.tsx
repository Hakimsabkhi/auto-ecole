import "@/app/globals.css";
import CompanyNav from "@/components/menu/CompanyNav";


// Load Poppins font with the desired weights and subsets


const RootLayout = async ({ children }: { children: React.ReactNode }) => {

  return (
    <html lang="en">
      <body>
        <div className="flex ">
        <CompanyNav />
        {children}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
