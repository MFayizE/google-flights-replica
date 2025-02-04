import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaClock, FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import debounce from "lodash.debounce";
import apiClient from "../../api/client";

export interface Airport {
  skyId: string;
  entityId: string;
  presentation: {
    title: string;
    suggestionTitle: string;
    subtitle: string;
  };
  navigation: {
    entityId: string;
    relevantFlightParams: {
      skyId: string;
    };
  };
}

interface Props {
  label: string;
  onSelect: (airport: Airport) => void;
  selectedAirport?: Airport;
}

const AirportSelect: React.FC<Props> = ({
  label,
  onSelect,
  selectedAirport,
}) => {
  const [query, setQuery] = useState("");
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<Airport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearchRef = useRef(
    debounce((value: string) => {
      fetchAirports(value);
    }, 500)
  );

  useEffect(() => {
    return () => {
      debouncedSearchRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    const savedSearches = JSON.parse(
      localStorage.getItem("recentSearches") || "[]"
    );
    setRecentSearches(savedSearches);
  }, []);

  const fetchAirports = useCallback(async (search: string) => {
    if (!search) return setAirports([]);

    setLoading(true);
    try {
      const response = await apiClient.get("/v1/flights/searchAirport", {
        params: { query: search, locale: "en-US" },
      });

      setAirports(response.data.status ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching airports:", error);
      setAirports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      debouncedSearchRef.current(value);
    } else {
      setAirports([]);
      debouncedSearchRef.current.cancel();
    }
  };

  const handleSelect = (airport: Airport) => {
    const selectedEntityId = airport.entityId;
    setQuery("");
    setIsOpen(false);
    onSelect(airport);

    setRecentSearches((prev) => {
      const updated = [
        airport,
        ...prev.filter((item) => item.entityId !== selectedEntityId),
      ].slice(0, 5);

      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
    <button
      className="lg:w-80 w-44 flex items-center justify-between border border-gray-300 dark:border-[#3C4043] p-4 rounded-lg bg-white dark:bg-[#292A2D] hover:shadow-md dark:hover:bg-[#3C4043] transition-all text-left text-sm"
      onClick={() => setIsOpen(true)}
    >
      <div className="flex items-center space-x-2">
        <FaSearch className="text-gray-500 dark:text-gray-400" />
        <span className="text-gray-700 dark:text-[#E8EAED]">
          {selectedAirport?.presentation?.suggestionTitle || label}
        </span>
      </div>
    </button>

    {isOpen && (
      <div className="absolute top-0 left-0 w-[160%] bg-white dark:bg-[#292A2D] shadow-xl border border-gray-300 dark:border-[#3C4043] rounded-lg px-6 py-2 z-50">
        <div className="flex items-center space-x-2 border-b border-[#d2e3fc] dark:border-[#3C4043]">
          <FaSearch className="text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search airports..."
            className="w-full outline-none text-xl p-2 text-gray-700 dark:text-[#E8EAED] bg-transparent placeholder:text-sm dark:placeholder:text-gray-400"
          />
        </div>

        {query && loading ? (
          <p className="p-3 text-gray-500 dark:text-gray-400">Loading...</p>
        ) : query && airports.length > 0 ? (
          airports.map((airport) => (
            <div
              key={airport.navigation.entityId}
              className="p-4 hover:bg-gray-100 dark:hover:bg-[#3C4043] cursor-pointer flex items-center transition-all"
              onClick={() => handleSelect(airport)}
            >
              <FaMapMarkerAlt className="text-blue-500 dark:text-[#8AB4F8] mr-3" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-[#E8EAED]">
                  {airport.presentation.suggestionTitle}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {airport.presentation.subtitle}
                </p>
              </div>
            </div>
          ))
        ) : query ? (
          <p className="p-4 text-gray-500 dark:text-gray-400">No results found</p>
        ) : recentSearches.length > 0 ? (
          <>
            <p className="px-4 py-2 text-gray-600 dark:text-gray-400 font-semibold">
              Recent Searches
            </p>
            {recentSearches.map((search, index) => (
              <div
                key={index}
                className="p-4 hover:bg-gray-100 dark:hover:bg-[#3C4043] cursor-pointer flex items-center transition-all"
                onClick={() => {
                  handleSelect(search);
                }}
              >
                <FaClock className="text-gray-500 dark:text-gray-400 mr-3" />
                <span className="text-gray-900 dark:text-[#E8EAED]">
                  {search.presentation.suggestionTitle}
                </span>
              </div>
            ))}
          </>
        ) : null}
      </div>
    )}
  </div>
  );
};

export default AirportSelect;
