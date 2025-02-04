import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { formatDuration, formatTime, formatCurrency } from "../utils/utils";
import { FlightDetail, FlightDetailData } from "../utils/types";
import apiClient from "../utils/client";

const FlightDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState<FlightDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLeg, setExpandedLeg] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          itineraryId: searchParams.get("itineraryId") || "",
          legs: searchParams.get("legs") || "",
          sessionId: searchParams.get("sessionId") || "",
          adults: searchParams.get("adults") || "1",
          currency: searchParams.get("currency") || "USD",
          cabinClass: searchParams.get("cabinClass") || "economy",
          countryCode: searchParams.get("countryCode") || "US",
        });

       

        const response = await apiClient.get(`/v1/flights/getFlightDetails?${params}`);

        if (!response.data) throw new Error("Failed to fetch flight details");
        const data = (await response.data ) as FlightDetail;

        if (data.status) {
          setDetails(data.data);
          setError(null);
        } else {
          throw new Error("Invalid flight details response");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch details"
        );
        setDetails(null);
      } finally {
        setLoading(false);
      }
    };

    const requiredParams = [
      "itineraryId",
      "sessionId",
      "legs",
      "adults",
      "currency",
      "cabinClass",
      "countryCode",
    ];

    if (requiredParams.some((param) => !searchParams.get(param))) {
      navigate("/");
    } else {
        fetchDetails();
    }
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-[#3C4043] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }


  if (error) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="text-red-600 dark:text-red-400 mb-4">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 dark:bg-[#8AB4F8] text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-[#84A9EB]"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6  text-gray-900 dark:text-[#E8EAED] rounded-lg">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-lg font-semibold dark:text-[#E8EAED]">Selected flights</h1>
      <div className="text-right">
        <p className="text-xl font-semibold">
          {formatCurrency(details?.itinerary.pricingOptions[0]?.totalPrice || 0)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Lowest total price</p>
      </div>
    </div>
  
    {details?.itinerary.legs.map((leg) => (
      <div
        key={leg.id}
        className="p-4 rounded-lg border border-gray-300 dark:border-[#3C4043] mb-4 bg-white dark:bg-[#292A2D]"
      >
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setExpandedLeg(expandedLeg === leg.id ? null : leg.id)}
        >
          <h3 className="text-lg font-semibold dark:text-[#E8EAED]">
            {leg.origin.city} ({leg.origin.displayCode}) → {leg.destination.city} ({leg.destination.displayCode})
          </h3>
          <div className="text-gray-600 dark:text-gray-400 flex items-center">
            {formatDuration(leg.duration)}
            {expandedLeg === leg.id ? (
              <FaChevronUp className="ml-2" />
            ) : (
              <FaChevronDown className="ml-2" />
            )}
          </div>
        </div>
        {expandedLeg === leg.id && (
          <div className="mt-4">
            {leg.segments.map((segment) => (
              <div key={segment.id} className="border-t dark:border-[#3C4043] pt-4 mt-4">
                <div className="flex justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={segment.marketingCarrier.logo}
                      alt={segment.marketingCarrier.name}
                      className="w-10 h-10 object-contain"
                    />
                    <div>
                      <p className="font-semibold dark:text-[#E8EAED]">
                        {segment.marketingCarrier.name} ({segment.marketingCarrier.displayCode})
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Flight {segment.flightNumber}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatTime(segment.departure)} → {formatTime(segment.arrival)}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                  {segment.origin.city} → {segment.destination.city}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    ))}
  
    {/* Booking Options */}
    <div className="bg-white dark:bg-[#292A2D] shadow-md rounded-lg p-6 mt-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-[#E8EAED] mb-4">
        Booking Options
      </h2>
      {details?.itinerary.pricingOptions.map((option) => (
        <div key={option.agents[0].id} className="flex justify-between items-center border-t dark:border-[#3C4043] py-4">
          <div>
            <p className="font-semibold dark:text-[#E8EAED]">{option.agents[0].name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Includes convenience fee</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600 dark:text-green-500">
              {formatCurrency(option.totalPrice)}
            </p>
            <a
              href={option.agents[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-[#8AB4F8] hover:underline dark:hover:text-[#84A9EB] text-sm"
            >
              Continue
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default FlightDetails;
