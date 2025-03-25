import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiUser, FiBriefcase, FiHome } from "react-icons/fi";
import { motion } from "framer-motion";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const { user, role, name, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [interestedBusinessCount, setInterestedBusinessCount] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [userProposals, setUserProposals] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchInterests = async () => {
        try {
          if (role === "Investor") {
            const interestQuery = query(collection(db, "investorInterests"), where("investorId", "==", user.uid));
            const interestSnapshot = await getDocs(interestQuery);
            setInterestedBusinessCount(interestSnapshot.size);
          } else if (role === "BusinessPerson") {
            const proposalQuery = query(collection(db, "businessProposals"), where("createdBy", "==", user.uid));
            const proposalSnapshot = await getDocs(proposalQuery);
            setUserProposals(proposalSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchInterests();

      const fetchProposals = async () => {
        try {
          const proposalsQuery = collection(db, "businessProposals");
          const proposalsSnapshot = await getDocs(proposalsQuery);
          const limitedProposals = proposalsSnapshot.docs.slice(0, 5).map((doc) => ({ id: doc.id, ...doc.data() }));
          setProposals(limitedProposals);
        } catch (error) {
          console.error("Error fetching proposals:", error);
        }
      };
      fetchProposals();
    }
  }, [user, role]);

  const handleNavigation = (path) => navigate(path);

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-100 to-indigo-100 font-sans">
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {name}!</h1>
              <p className="text-gray-600 text-sm">{new Date().toDateString()}</p>
              <div className="mt-4">
                <p className="text-gray-600 text-sm">Email: <span className="font-medium">{user?.email}</span></p>
                <p className="text-gray-600 text-sm mt-1">Role: <span className="font-medium">{role}</span></p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              {role === "Investor" ? (
                <>
                  <h2 className="text-xl font-semibold mb-4">Businesses You're Interested In</h2>
                  <p className="text-4xl font-bold text-gray-800">{interestedBusinessCount}</p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-4">Your Created Proposals</h2>
                  <p className="text-4xl font-bold text-gray-800">{userProposals.length}</p>
                </>
              )}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg lg:col-span-2">
              <h2 className="text-xl font-semibold mb-6">Available Proposals</h2>
              {proposals.map((proposal) => (
                <div key={proposal.id} className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800">{proposal.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{proposal.description}</p>
                </div>
              ))}
              <button
                onClick={() => handleNavigation(role === "Investor" ? '/proposals' : '/my-proposals')}
                className="mt-6 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
              >
                View More Proposals
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;