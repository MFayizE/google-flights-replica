import { FaExchangeAlt, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useFlightSearchStore from "../../store/state";
import DatePicker from "../DatePicker";
import PassengerSelector from "../PassengerSelector";
import AirportSelect from "../SearchableAirportSelect";
import SelectDropdown from "./SelectDropdown";

const FlightSearch = () => {
  const { flightQuery, setFlightQuery } = useFlightSearchStore();
  const tripOptions = [
    { value: "true", label: "Round trip" },
    { value: "false", label: "One way" },
  ];

  const cabinOptions = [
    { value: "economy", label: "Economy" },
    { value: "premium-economy", label: "Premium Economy" },
    { value: "business", label: "Business" },
    { value: "first", label: "First" },
  ];
  const navigate = useNavigate();

  const isFormValid = Boolean(
    flightQuery.originAirport &&
      flightQuery.destinationAirport &&
      flightQuery.date &&
      (!flightQuery.roundTrip || flightQuery.returnDate) &&
      flightQuery.adults > 0
  );
  
  const handleSearch = () => {
    if (!isFormValid) return;

    const params = new URLSearchParams({
      originSkyId: flightQuery.originAirport!.skyId,
      originEntityId: flightQuery.originAirport!.navigation.entityId,
      destinationSkyId: flightQuery.destinationAirport!.skyId,
      destinationEntityId: flightQuery.destinationAirport!.navigation.entityId,
      date: flightQuery.date!,
      returnDate: flightQuery.roundTrip ? flightQuery.returnDate! : "",
      cabinClass: flightQuery.cabinClass,
      adults: flightQuery.adults.toString(),
      childrens: flightQuery.childrens.toString(),
      infants: flightQuery.infants.toString(),
      roundTrip: flightQuery.roundTrip.toString(),
      sortBy: flightQuery.sortBy,
      currency: flightQuery.currency,
      market: flightQuery.market,
      countryCode: flightQuery.countryCode,
    });

    navigate(`/search-results?${params.toString()}`);
  };
  return (
    <div className="relative max-w-5xl mx-auto bg-white dark:bg-[#292A2D] px-4 md:px-6 py-9 mt-6 rounded-lg shadow-lg flex flex-col gap-5">
      <div className="flex flex-row gap-3 md:justify-start justify-center">
        <SelectDropdown
          options={tripOptions}
          selected={
            flightQuery.roundTrip
              ? "true"
              : flightQuery.roundTrip === false
              ? "false"
              : "multi-city"
          }
          onSelect={(value) => setFlightQuery({ roundTrip: value === "true" })}
        />
        <PassengerSelector />
        <SelectDropdown
          options={cabinOptions}
          selected={flightQuery.cabinClass}
          onSelect={(value) => setFlightQuery({ cabinClass: value })}
        />
      </div>

      {/* Second Row: Airports & Date Picker */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <AirportSelect
            label="Where from?"
            onSelect={(airport) => setFlightQuery({ originAirport: airport })}
            selectedAirport={flightQuery.originAirport}
          />
          <FaExchangeAlt className="text-gray-500 dark:text-gray-400 text-2xl hidden sm:block" />
          <AirportSelect
            label="Anywhere"
            onSelect={(airport) =>
              setFlightQuery({ destinationAirport: airport })
            }
            selectedAirport={flightQuery.destinationAirport}
          />
        </div>
        <DatePicker
          originSkyId={flightQuery.originAirport?.skyId}
          key={`${flightQuery.destinationAirport?.skyId}-${flightQuery.originAirport?.skyId}`}
          destinationSkyId={flightQuery.destinationAirport?.skyId}
          roundTrip={flightQuery.roundTrip}
        />
      </div>

      <div className="absolute bottom-[-24px] left-1/2 transform -translate-x-1/2">
        <button
          className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-md text-xs font-semibold transition
            bg-[#1A72E9]  text-white
        ${
          isFormValid
            ? ""
            : "cursor-not-allowed"
        }`}
          onClick={handleSearch}
          disabled={!isFormValid}
        >
          <FaSearch className="text-white" />
          Search
        </button>
      </div>
    </div>
  );
};

export default FlightSearch;
