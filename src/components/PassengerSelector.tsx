import React, { useState, useRef, useEffect } from "react";
import { FaUser, FaPlus, FaMinus, FaChevronDown } from "react-icons/fa";
import useFlightSearchStore, { FlightQuery } from "../store/state";

const PassengerSelector: React.FC = () => {
  const { flightQuery, setFlightQuery } = useFlightSearchStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updatePassengers = (type: keyof FlightQuery, increment: boolean) => {
    const value = flightQuery[type];
    if (typeof value === "number") {
      setFlightQuery({ [type]: Math.max(0, value + (increment ? 1 : -1)) });
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 flex items-center gap-2 rounded-lg bg-white dark:bg-[#292A2D] border border-gray-300 dark:border-[#3C4043] hover:bg-gray-100 dark:hover:bg-[#3C4043] transition-all min-w-[100px]"
      >
        <FaUser className="text-gray-600 dark:text-gray-400" />
        {flightQuery.adults + flightQuery.childrens + flightQuery.infants}
        <FaChevronDown className="text-gray-500 dark:text-gray-400 text-sm" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-72 bg-white dark:bg-[#292A2D] shadow-xl border border-gray-300 dark:border-[#3C4043] rounded-lg p-4 z-50">
          {[
            { label: "Adults", type: "adults" as const },
            { label: "Children (2-11)", type: "childrens" as const },
            { label: "Infants (In seat)", type: "infants" as const },
          ].map(({ label, type }) => (
            <div key={type} className="flex justify-between items-center py-3">
              <div className="text-left">
                <p className="text-gray-900 dark:text-[#E8EAED] font-medium">{label}</p>
                {type === "childrens" && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Aged 2-11</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updatePassengers(type, false)}
                  className="p-2 border border-gray-300 dark:border-[#3C4043] rounded-md bg-gray-200 dark:bg-[#3C4043] hover:bg-gray-300 dark:hover:bg-[#474A4D] disabled:opacity-50"
                  disabled={flightQuery[type] === 0}
                >
                  <FaMinus className="text-gray-700 dark:text-gray-300" />
                </button>
                <span className="w-6 text-center text-gray-900 dark:text-[#E8EAED]">
                  {flightQuery[type]}
                </span>
                <button
                  onClick={() => updatePassengers(type, true)}
                  className="p-2 border border-gray-300 dark:border-[#3C4043] rounded-md bg-gray-200 dark:bg-[#3C4043] hover:bg-gray-300 dark:hover:bg-[#474A4D]"
                >
                  <FaPlus className="text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-4">
            <button
              className="text-blue-600 dark:text-[#8AB4F8] hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              className="text-blue-600 dark:text-[#8AB4F8] font-semibold hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerSelector;
