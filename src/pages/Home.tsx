import { useEffect } from "react";
import FlightSearch from "../components/common/FlightSearch";
import useFlightSearchStore from "../store/state";

const Home = () => {
  const { resetFlightQuery } = useFlightSearchStore();

  useEffect(() => {
    resetFlightQuery();
  }, []);
  
  return (
    <div>
      <section className="relative w-full text-center mb-12">
        <img
          src="https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_4.svg"
          alt="Flights Illustration"
          className="w-full max-w-7xl mx-auto dark:hidden"
        />
        <img
          src="https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_dark_theme_4.svg"
          alt="Flights Illustration Dark Mode"
          className="w-full max-w-7xl mx-auto hidden dark:block"
        />
        <h1 className="text-4xl md:text-6xl font-medium mb-4 -mt-16">
          Flights
        </h1>
      </section>
      <FlightSearch />
    </div>
  );
};

export default Home;
