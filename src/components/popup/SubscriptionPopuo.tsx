import React from 'react';

interface Subscription {
  _id: number;
  name: string;
  life: number;
  price: number;
}

interface SubscriptionPopupProps {
  subscriptions: Subscription[]; // Array of subscriptions
  handleClosesub: () => void;
  selectedSubscription: string | null; // It expects a string or null
  setSelectedSubscription: React.Dispatch<React.SetStateAction<string | "">>;
  handleSubChange:()=>void;
}

const SubscriptionPopup: React.FC<SubscriptionPopupProps> = ({
  subscriptions,
  handleClosesub,
  selectedSubscription,
  setSelectedSubscription,
  handleSubChange,
}) => {
  
  // Update the selected subscription with the string value of the subscription _id
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSubscription(event.target.value); // set value as string
  };

  return (
    <div className="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover backdrop-filter backdrop-brightness-75">
      <div className="absolute opacity-80 inset-0 z-0"></div>
      <div className="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
        {/* content */}
        <div>
          <label htmlFor="subscription" className="block text-sm font-medium text-gray-700">
            Subscription
          </label>
          <div id="subscription" className="mt-2 p-3 border border-gray-300 rounded w-full">
           
            <div className="mt-2">
              {subscriptions.map((subscription) => (
                <label key={subscription._id} className="block">
                  <input
                    type="radio"
                    name="subscription"
                    value={subscription._id.toString()} // Make sure value is string
                    checked={selectedSubscription === subscription._id.toString()} // Ensure comparison with string
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {subscription.name} {subscription.life} DAY {subscription.price} DT
                </label>
              ))}
            </div>
          </div>
          <div className="p-3 mt-2 text-center space-x-4 md:block">
            <button
              onClick={handleClosesub}
              className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border rounded-full hover:shadow-lg hover:bg-gray-500 hover:border-gray-500 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={()=>handleSubChange()}
              className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border rounded-full hover:shadow-lg hover:bg-green-500 hover:border-green-500 hover:text-white"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPopup;
