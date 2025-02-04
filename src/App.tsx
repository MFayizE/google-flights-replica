import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchResults from "./pages/SearchResults";
import FlightDetails from "./pages/FlightDetails";
import Home from "./pages/Home";
import Layout from "./layout/layout";

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