// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 p-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-2 text-center items-center">
          <img src="/inverted-logo.svg" alt="logo" className="w-9 h-9"/>
          <Link to="/" className="text-white text-2xl font-bold">
            Investor Connect
          </Link>
        </div>

        <div className="space-x-4">
          {!user ? (
            <>
              <Link to="/login" className=" bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-200 font-medium">
                Login
              </Link>
              <Link to="/register" className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-200 font-medium">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-200 font-medium">
                Dashboard
              </Link>

              {role && role === "Investor" && (
                <Link to="/proposals" className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-200 font-medium">
                  View Proposals
                </Link>
              )}

              {role && role === "Investor" && (
                <Link to="/manage-investment" className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-200 font-medium">
                    Manage Investments
              </Link>
              )}
              {user && role === "BusinessPerson" && (
                <Link to="/interested-investors" className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-300 font-medium">
                    Interested Investors
                </Link>
                )}
            {user && role === "BusinessPerson" && (
            <Link to="/my-proposals" className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-200 font-medium">
                My Proposals
            </Link>
            )}

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-white bg-orange-500 px-4 py-2 border-none rounded-md hover:bg-orange-600 font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
