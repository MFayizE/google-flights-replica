import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa";

interface SelectDropdownProps {
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({ options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 flex items-center gap-2 rounded-lg bg-white dark:bg-[#292A2D] border border-gray-300 dark:border-[#3C4043] hover:bg-gray-100 dark:hover:bg-[#3C4043] transition-all min-w-[140px] text-gray-900 dark:text-[#E8EAED]"
      >
        {options.find((opt) => opt.value === selected)?.label}
        <FaChevronDown className="text-gray-500 dark:text-gray-400 text-sm" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-48 bg-white dark:bg-[#292A2D] shadow-lg border border-gray-300 dark:border-[#3C4043] rounded-lg z-50">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-[#3C4043] transition-all ${
                selected === option.value ? "bg-blue-100 dark:bg-[#3C4043]" : ""
              }`}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
              {selected === option.value && (
                <FaCheck className="text-blue-600 dark:text-[#8AB4F8]" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;
