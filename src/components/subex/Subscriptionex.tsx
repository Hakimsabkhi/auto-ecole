'use client';

import { useSession } from 'next-auth/react';
import React, { ReactNode } from 'react';

interface SubscriptionexProps {
  children: ReactNode;
}

const Subscriptionex: React.FC<SubscriptionexProps> = ({ children }) => {
  const { data: session } = useSession();

  return (
  <div className='w-full'>
        {session?.user.on===true &&children}
    
    </div>
  );
};

export default Subscriptionex;
