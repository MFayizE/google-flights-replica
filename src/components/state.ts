import { create } from "zustand";
import { Airport } from "./common/SearchableAirportSelect";

export interface FlightQuery {
  originAirport?: Airport;
  destinationAirport?: Airport;
  cabinClass: string;
  adults: number;
  childrens: number;
  infants: number;
  sortBy: string;
  currency: string;
  market: string;
  countryCode: string;
  roundTrip: boolean;
  date: string;
  returnDate?: string;
}

interface FlightSearchState {
  flightQuery: FlightQuery;
  setFlightQuery: (updates: Partial<FlightQuery>) => void;
  resetFlightQuery: () => void;
}

const defaultFlightQuery: FlightQuery = {
  date: "",
  originAirport: undefined,
  destinationAirport: undefined,
  cabinClass: "economy",
  adults: 1,
  childrens: 0,
  infants: 0,
  sortBy: "best",
  currency: "USD",
  market: "en-US",
  countryCode: "US",
  roundTrip: true,
  returnDate: undefined,
};

const useFlightSearchStore = create<FlightSearchState>((set) => ({
  flightQuery: { ...defaultFlightQuery },
  setFlightQuery: (updates) =>
    set((state) => ({
      flightQuery: { ...state.flightQuery, ...updates },
    })),
  resetFlightQuery: () => set({ flightQuery: { ...defaultFlightQuery } }),
}));

export default useFlightSearchStore;
