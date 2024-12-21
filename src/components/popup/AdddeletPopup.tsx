import React, { FormEvent } from 'react';

interface DataSelect {
  id: string;
  val: string;
  ref: string;
}

interface AdddeletPopupProps {
  handleClosePopup: () => void;
  selectvalref: DataSelect;
  handleupdate: (id: string, val: string, ref: string, input: string) => void;
}

const AdddeletPopup: React.FC<AdddeletPopupProps> = ({ handleClosePopup, selectvalref, handleupdate }) => {
  const updateHours = (e: FormEvent) => {
    e.preventDefault();
    // Capture the value of the input field
  
    const input = (e.target as HTMLFormElement).elements.namedItem('hours') as HTMLInputElement;
    const inputValue = input?.value || ''; // Use empty string if input value is undefined
    handleupdate(selectvalref.id, selectvalref.val, selectvalref.ref, inputValue);
    handleClosePopup()
  };

  return (
    <div
      className="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover backdrop-filter backdrop-brightness-75"
    >
      <div className="absolute inset-0 z-0 opacity-80 bg-black"></div> {/* Fixed the opacity issue */}
      <div className="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
        {/* content */}
        <div>
          {/* body */}
          <div className="text-center p-5 flex-auto justify-center">
            <h2 className="text-xl font-bold py-4">
              {selectvalref.ref === '-' ? 'Remove Hours' : 'Add Hours'}
            </h2>

            <form onSubmit={updateHours}>
              <input
                type="number"
                name="hours"
                className="border-2 border-gray-400 rounded p-2 font-bold text-center uppercase"
                required
              />
              {/* Submit button inside the form */}
              <div className="p-3 mt-2 text-center space-x-4 md:block">
                <button
                  type="button" // Changed to type="button" to prevent form submission
                  onClick={handleClosePopup} // directly use the handleClosePopup function
                  className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-primary rounded-full hover:shadow-lg hover:bg-[#15335D] hover:border-[#15335D] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit" // This is the correct submit behavior
                  className="mb-2 md:mb-0 px-5 py-2 text-sm shadow-sm font-medium tracking-wider rounded-full"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
          {/* footer */}
        </div>
      </div>
    </div>
  );
};

export default AdddeletPopup;
