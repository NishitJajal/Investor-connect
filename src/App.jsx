import { Routes, Route } from "react-router-dom";
// import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./Components/PrivateRoute";
import Navbar from "./Components/Navbar"; 
import Proposals from "./Pages/Proposals";
import InterestedInvestors from "./Pages/InterestedInvestor";
import MyProposals from "./Pages/MyProposals";
import LandingPage from "./Pages/LandingPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/proposals" element={<PrivateRoute><Proposals /></PrivateRoute>}/>
        <Route path="/interested-investors" element={<PrivateRoute><InterestedInvestors /></PrivateRoute>}/>
        <Route path="/my-proposals" element={<PrivateRoute><MyProposals /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;