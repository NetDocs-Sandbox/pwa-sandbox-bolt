import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiChevronDown, FiX } from 'react-icons/fi';

interface Option {
  id: string;
  name: string;
  [key: string]: any; // Allow additional properties
}

interface SearchableDropdownProps {
  options: Option[];
  value: Option | null;
  onChange: (option: Option | null) => void;
  placeholder: string;
  label: string;
}

export function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder,
  label,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white border rounded-md cursor-pointer hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value ? value.name : placeholder}
        </span>
        <div className="flex items-center">
          {value && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
                setSearchTerm('');
              }}
              className="p-1 hover:bg-gray-100 rounded-full mr-1"
            >
              <FiX className="w-4 h-4 text-gray-500" />
            </button>
          )}
          <FiChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          <div className="p-2 border-b">
            <div className="flex items-center px-2 bg-gray-50 rounded-md">
              <FiSearch className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full px-2 py-1 text-sm bg-transparent border-none focus:outline-none"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              onClick={() => {
                onChange(null);
                setIsOpen(false);
                setSearchTerm('');
              }}
            >
              None
            </button>
            {filteredOptions.map((option) => (
              <button
                key={option.id}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}