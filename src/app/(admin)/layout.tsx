import "@/app/globals.css";
import AdminNav from "@/components/menu/AdminNav";
import HeaderAdmin from "@/components/menu/HeaderAdmin";

// Load Poppins font with the desired weights and subsets


const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
      <HeaderAdmin/>
        <AdminNav />
        {children}
      
      </body>
    </html>
  );
};

export default RootLayout;
