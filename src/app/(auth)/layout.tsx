

import { Metadata } from "next";


export const metadata: Metadata = {
  title: "singin",
  description: "login for auth",
};


const RootLayout = async ({ children }: { children: React.ReactNode }) => {




  return (
    <html lang="en">
<body >
       
          {children}
   
      </body>
    </html>
  );
};

export default RootLayout;
