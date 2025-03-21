import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiUser, FiBriefcase, FiHome } from "react-icons/fi";

const Dashboard = () => {
  const { user, role, name, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-xl font-bold text-blue-600">Investor Connect</h2>
        <ul className="mt-6 space-y-4">
          <li className="flex items-center text-gray-700 hover:text-blue-500 cursor-pointer">
            <FiHome className="mr-2" /> Home
          </li>
          <li className="flex items-center text-gray-700 hover:text-blue-500 cursor-pointer">
            <FiUser className="mr-2" /> Profile
          </li>
          {role === "Investor" ? (
            <li className="flex items-center text-gray-700 hover:text-green-500 cursor-pointer">
              <FiBriefcase className="mr-2" /> Browse Investments
            </li>
          ) : (
            <li className="flex items-center text-gray-700 hover:text-blue-500 cursor-pointer">
              <FiBriefcase className="mr-2" /> My Proposals
            </li>
          )}
        </ul>

        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="w-full mt-8 bg-orange-500 text-white py-2 rounded flex items-center justify-center hover:bg-orange-600"
        >
          <FiLogOut className="mr-2" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-md mt-4">
          <h2 className="text-xl font-semibold">Welcome, {name}!</h2>
          <p className="text-gray-600 mt-1">Email: <span className="font-medium">{user?.email}</span></p>
          <p className="text-gray-600">Role: <span className="font-medium">{role}</span></p>

          {role === "Investor" ? (
            <p className="mt-4 text-green-600">You can browse and invest in businesses.</p>
          ) : (
            <p className="mt-4 text-blue-600">You can create and manage business proposals.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
