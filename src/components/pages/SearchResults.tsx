import { useEffect, useState, useMemo } from "react";
import { FaChevronDown, FaChevronUp, FaSlidersH } from "react-icons/fa";
import { FlightSearchResults, Leg } from "../types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatDuration, formatTime, formatCurrency } from "../utils";
import FlightSearch from "../common/FlightSearch";
import apiClient from "../../api/client";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const originSkyId = searchParams.get("originSkyId");
  const originEntityId = searchParams.get("originEntityId");
  const destinationSkyId = searchParams.get("destinationSkyId");
  const destinationEntityId = searchParams.get("destinationEntityId");
  const date = searchParams.get("date");
  const returnDate = searchParams.get("returnDate");
  const cabinClass = searchParams.get("cabinClass");
  const adults = searchParams.get("adults");
  const childrens = searchParams.get("childrens");
  const infants = searchParams.get("infants");
  const roundTrip = searchParams.get("roundTrip") === "true";
  const sortBy = searchParams.get("sortBy");
  const currency = searchParams.get("currency");
  const market = searchParams.get("market");
  const countryCode = searchParams.get("countryCode");

  const [flights, setFlights] = useState<FlightSearchResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visibleFlights, setVisibleFlights] = useState(3);

  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selectedAirlines, setSelectedAirlines] = useState<number[]>([]);
  const [selectedStops, setSelectedStops] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [durationRange, setDurationRange] = useState<[number, number]>([
    0, 1440,
  ]);
  const { priceBounds, durationBounds } = useMemo(() => {
    const defaultBounds = {
      priceBounds: [0, 5000] as [number, number],
      durationBounds: [0, 1440] as [number, number],
    };

    if (!flights?.data) return defaultBounds;

    const prices = flights.data.itineraries.map((it) => it.price.raw);
    const durations = flights.data.itineraries.flatMap((it) =>
      it.legs.map((leg) => leg.durationInMinutes)
    );

    return {
      priceBounds: [Math.min(...prices), Math.max(...prices)] as [
        number,
        number
      ],
      durationBounds: [Math.min(...durations), Math.max(...durations)] as [
        number,
        number
      ],
    };
  }, [flights]);
  useEffect(() => {
    if (flights?.data) {
      setPriceRange(priceBounds);
      setDurationRange(durationBounds);
    }
  }, [flights, priceBounds, durationBounds]);

  const filteredItineraries = useMemo(() => {
    return (
      flights?.data?.itineraries?.filter((itinerary) => {
        const priceValid =
          itinerary.price.raw >= priceRange[0] &&
          itinerary.price.raw <= priceRange[1];
        const durationValid = itinerary.legs.every(
          (leg) =>
            leg.durationInMinutes >= durationRange[0] &&
            leg.durationInMinutes <= durationRange[1]
        );
        const stopsValid =
          selectedStops.length === 0 ||
          itinerary.legs.some((leg) => selectedStops.includes(leg.stopCount));
        const airlinesValid =
          selectedAirlines.length === 0 ||
          itinerary.legs.some((leg) =>
            leg.carriers.marketing.some((c) => selectedAirlines.includes(c.id))
          );

        return priceValid && durationValid && stopsValid && airlinesValid;
      }) || []
    );
  }, [flights, priceRange, durationRange, selectedStops, selectedAirlines]);

  // Fetch flights
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get(
          "/v2/flights/searchFlights?" +
            new URLSearchParams({
              originSkyId: originSkyId!,
              destinationSkyId: destinationSkyId!,
              originEntityId: originEntityId!,
              destinationEntityId: destinationEntityId!,
              date: date!,
              cabinClass: cabinClass!,
              adults: adults!,
              childrens: childrens || "0",
              infants: infants || "0",
              sortBy: sortBy || "best",
              currency: currency || "USD",
              market: market || "en-US",
              countryCode: countryCode || "US",
              ...(roundTrip && returnDate ? { returnDate } : {}),
            })
        );

        if (!response.data) throw new Error("Failed to fetch flights");
        const data = await response.data ;

        setFlights(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch flights"
        );
        setFlights(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [searchParams]);

  // Filter dropdown component
  const FilterDropdown = ({
    title,
    name,
    children,
  }: {
    title: string;
    name: string;
    children: React.ReactNode;
  }) => (
    <div className="relative">
      <button
        onClick={() => setOpenFilter(openFilter === name ? null : name)}
        className={`flex items-center px-4 py-2 rounded-lg border transition-all ${
          openFilter === name
            ? "bg-blue-50 dark:bg-[#3C4043] border-blue-500 dark:border-[#8AB4F8]"
            : "border-gray-200 dark:border-[#3C4043] hover:border-gray-300 dark:hover:border-gray-500"
        } text-gray-900 dark:text-[#E8EAED]`}
      >
        <span className="mr-2">{title}</span>
        <FaChevronDown
          className={`w-4 h-4 transition-transform ${
            openFilter === name ? "rotate-180" : ""
          }`}
        />
      </button>
      {openFilter === name && (
        <div className="absolute top-12 left-0 bg-white dark:bg-[#292A2D] p-4 rounded-xl shadow-xl dark:shadow-lg border border-gray-200 dark:border-[#3C4043] min-w-[280px] z-10">
          {children}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 dark:bg-[#3C4043] rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="text-red-600 dark:text-red-400 mb-4">
          Error: {error}
        </div>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-[#E8EAED]">
      <div className="mb-6">
        <FlightSearch />
      </div>

      <div className="flex flex-wrap gap-4 py-6 border-b border-gray-200 dark:border-[#3C4043]">
        <FilterDropdown title="Price" name="price">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>{formatCurrency(priceRange[0])}</span>
              <span>{formatCurrency(priceRange[1])}</span>
            </div>
            <div className="flex gap-4">
              <input
                type="range"
                min={priceBounds[0]}
                max={priceBounds[1]}
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="w-full dark:bg-[#3C4043]"
              />
              <input
                type="range"
                min={priceBounds[0]}
                max={priceBounds[1]}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-full dark:bg-[#3C4043]"
              />
            </div>
          </div>
        </FilterDropdown>

        <FilterDropdown title="Stops" name="stops">
          <div className="space-y-2">
            {[0, 1, 2].map((stop) => (
              <label key={stop} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedStops.includes(stop)}
                  onChange={(e) =>
                    setSelectedStops(
                      e.target.checked
                        ? [...selectedStops, stop]
                        : selectedStops.filter((s) => s !== stop)
                    )
                  }
                  className="rounded text-blue-600 dark:text-[#8AB4F8]"
                />
                <span className="dark:text-[#E8EAED]">
                  {stop === 0
                    ? "Nonstop"
                    : `${stop} stop${stop > 1 ? "s" : ""}`}
                </span>
              </label>
            ))}
          </div>
        </FilterDropdown>
        <FilterDropdown title="Airlines" name="airlines">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {flights?.data?.filterStats?.carriers?.map((carrier) => (
              <label key={carrier.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedAirlines.includes(carrier.id)}
                  onChange={(e) =>
                    setSelectedAirlines(
                      e.target.checked
                        ? [...selectedAirlines, carrier.id]
                        : selectedAirlines.filter((id) => id !== carrier.id)
                    )
                  }
                  className="rounded text-blue-600"
                />
                <img
                  src={carrier.logoUrl}
                  alt={carrier.name}
                  className="w-6 h-6"
                />
                <span>{carrier.name}</span>
              </label>
            ))}
          </div>
        </FilterDropdown>

        <FilterDropdown title="Duration" name="duration">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>{formatDuration(durationRange[0])}</span>
              <span>{formatDuration(durationRange[1])}</span>
            </div>
            <div className="flex gap-4">
              <input
                type="range"
                min={durationBounds[0]}
                max={durationBounds[1]}
                value={durationRange[0]}
                onChange={(e) =>
                  setDurationRange([Number(e.target.value), durationRange[1]])
                }
                className="w-full"
              />
              <input
                type="range"
                min={durationBounds[0]}
                max={durationBounds[1]}
                value={durationRange[1]}
                onChange={(e) =>
                  setDurationRange([durationRange[0], Number(e.target.value)])
                }
                className="w-full"
              />
            </div>
          </div>
        </FilterDropdown>
      </div>

      {/* Results Count */}
      <div className="py-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold dark:text-[#E8EAED]">
          {filteredItineraries.length} results
        </h3>
        <button className="text-blue-600 dark:text-[#8AB4F8] hover:text-blue-800 dark:hover:text-[#84A9EB] flex items-center">
          <FaSlidersH className="mr-2" />
          Sort & Filter
        </button>
      </div>

      {/* Flight Results */}
      <div className="grid grid-cols-1  gap-4">
        {filteredItineraries.slice(0, visibleFlights).map((itinerary) => (
          <div
            key={itinerary.id}
            className="bg-white dark:bg-[#292A2D] cursor-pointer rounded-xl border border-gray-200 dark:border-[#3C4043] hover:border-blue-500 dark:hover:border-[#8AB4F8] transition-all p-4"
            onClick={() =>
              setExpandedId(expandedId === itinerary.id ? null : itinerary.id)
            }
          >
            {/* Flight Summary */}
            <div className="grid grid-cols-5 gap-4 items-center">
              <div className="col-span-2 flex items-center gap-4">
                <img
                  src={itinerary.legs[0].carriers.marketing[0].logoUrl}
                  alt={itinerary.legs[0].carriers.marketing[0].name}
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <p className="flex gap-2 text-black dark:text-[#E8EAED] text-sm font-semibold">
                    {formatTime(itinerary.legs[0].segments[0].departure)} -{" "}
                    {formatTime(itinerary.legs[0].segments[0].arrival)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {itinerary.legs[0].carriers.marketing[0].name}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-[#E8EAED]">
                {formatDuration(itinerary.legs[0].durationInMinutes)}
              </p>

              <p className="text-sm dark:text-[#E8EAED]">
                {itinerary.legs[0].stopCount === 0
                  ? "Nonstop"
                  : `${itinerary.legs[0].stopCount} stops`}
              </p>

              <div className=" flex  items-center justify-end gap-4">
                <div>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {itinerary.price.formatted}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {roundTrip && "Round Trip"}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setExpandedId(
                      expandedId === itinerary.id ? null : itinerary.id
                    )
                  }
                  className="text-gray-600 dark:text-[#E8EAED] mt-2 flex items-center"
                >
                  {expandedId === itinerary.id ? (
                    <FaChevronUp className="w-4 h-4 mr-2" />
                  ) : (
                    <FaChevronDown className="w-4 h-4 mr-2" />
                  )}
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === itinerary.id && (
              <div className="p-6 border-t border-gray-200 dark:border-[#3C4043] bg-gray-50 dark:bg-[#202124] rounded-b-xl">
                {itinerary.legs.map((leg, legIndex) => (
                  <div key={leg.id} className="mb-6 last:mb-0">
                    <div className="flex justify-between mb-4">
                      <h4 className="font-semibold dark:text-[#E8EAED]">
                        {legIndex === 0 ? "Outbound" : "Return"} ·{" "}
                        {leg.segments.length} segment(s)
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {formatDuration(leg.durationInMinutes)} ·{" "}
                        {leg.stopCount} stops
                      </p>
                    </div>

                    {leg.segments.map((segment) => (
                      <div
                        key={segment.id}
                        className="flex flex-col sm:flex-row items-center py-3 space-x-4 border-b dark:border-[#3C4043] last:border-none"
                      >
                        <img
                          src={
                            leg.carriers.marketing.find(
                              (c) => c.id === segment.marketingCarrier.id
                            )?.logoUrl
                          }
                          alt={segment.marketingCarrier.name}
                          className="w-8 h-8 object-contain"
                        />
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div>
                            <p className="font-medium dark:text-[#E8EAED]">
                              {segment.origin.displayCode}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatTime(segment.departure)}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium dark:text-[#E8EAED]">
                              {segment.destination.displayCode}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatTime(segment.arrival)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-800 dark:text-[#E8EAED]">
                              {segment.marketingCarrier.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Flight {segment.flightNumber}
                            </p>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {segment.operatingCarrier &&
                              `Operated by ${segment.operatingCarrier.name}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => {
                      // Create the legs array with proper encoding
                      const legsArray = itinerary.legs.map((leg: Leg) => ({
                        origin: leg.origin.id,
                        destination: leg.destination.id,
                        date: leg.departure.split("T")[0],
                      }));

                      // Stringify and properly escape for API format
                      const legsJson = JSON.stringify(legsArray);
                      const escapedLegs = `"${legsJson.replace(/"/g, '\\"')}"`;

                      const searchParams = new URLSearchParams({
                        itineraryId: itinerary?.id,
                        sessionId: flights?.sessionId || "",
                        legs: escapedLegs,
                        adults: adults!,
                        children: childrens || "0",
                        infants: infants || "0",
                        currency: currency || "USD",
                        locale: "en-US",
                        market: market || "en-US",
                        cabinClass: cabinClass || "economy",
                        countryCode: countryCode || "US",
                      });

                      navigate(`/flight-details?${searchParams.toString()}`);
                    }}
                  >
                    Select flight
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {visibleFlights < filteredItineraries.length && (
        <div className="py-6 text-center">
          <button
            onClick={() => setVisibleFlights((prev) => prev + 5)}
            className="px-8 py-3 bg-white dark:bg-[#292A2D] border border-gray-300 dark:border-[#3C4043] rounded-lg hover:bg-gray-50 dark:hover:bg-[#3C4043] text-blue-600 dark:text-[#8AB4F8]"
          >
            Show more flights
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
