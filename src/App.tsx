import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchResults from "./components/pages/SearchResults";
import FlightDetails from "./components/pages/FlightDetails";
import Home from "./components/pages/Home";
import Layout from "./components/layout/layout";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/flight-details" element={<FlightDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;