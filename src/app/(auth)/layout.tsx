
import SessionProviderWrapper from "@/components/compsession/SessionProviderWrapper";
import { authOptions } from "@/lib/authOptions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "singin",
  description: "login for auth",
};


const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);



  return (
    <html lang="en">
<body >
        <SessionProviderWrapper session={session}>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
