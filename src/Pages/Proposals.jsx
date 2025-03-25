import { useState, useEffect, useContext } from "react";
import { db } from "../firebase/firebase";
import { AuthContext } from "../context/AuthContext";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

const Proposals = () => {
  const { user, role } = useContext(AuthContext);
  const [proposals, setProposals] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterInvestment, setFilterInvestment] = useState("");

  useEffect(() => {
    const fetchProposals = async () => {
      const querySnapshot = await getDocs(collection(db, "businessProposals"));
      setProposals(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProposals();
  }, []);

  const filteredProposals = proposals.filter((proposal) => {
    return (
      (!filterCategory || proposal.category === filterCategory) &&
      (!filterInvestment || proposal.requiredInvestment <= filterInvestment)
    );
  });

  const handleInterest = async (proposalId, investmentAmount) => {
    if (!investmentAmount) return alert("Enter an investment amount.");

    try {
      await addDoc(collection(db, "investorInterests"), {
        investorId: user.uid,
        proposalId,
        investmentAmount: Number(investmentAmount),
        createdAt: new Date(),
      });
      alert("Interest submitted successfully!");
    } catch (error) {
      console.error("Error submitting interest:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-8 bg-gradient-to-r from-blue-50 to-white-50 shadow-lg rounded-xl">
      <motion.h2
        className="text-4xl font-semibold mb-8 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Business Proposals
      </motion.h2>

      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border p-3 rounded-lg w-full sm:w-auto focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Categories </option>
          <option value="Technology">Technology</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
          <option value="Education">Education</option>
        </select>

        <input
          type="number"
          placeholder="Max Investment"
          value={filterInvestment}
          onChange={(e) => setFilterInvestment(e.target.value)}
          className="border p-3 rounded-lg w-full sm:w-auto focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {filteredProposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProposals.map(proposal => (
            <motion.div
              key={proposal.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{proposal.title}</h3>
              <p className="text-gray-600 mb-2">{proposal.description}</p>
              <p className="text-gray-700 font-medium">Investment Required: ${proposal.requiredInvestment}</p>
              <p className="text-gray-700 font-medium">Expected ROI: {proposal.expectedROI}%</p>
              <p className="text-gray-700 font-medium">Category: {proposal.category}</p>

              {role === "Investor" && (
                <div className="mt-4">
                  <input
                    type="number"
                    placeholder="Investment Amount"
                    className="border p-2 rounded-lg mr-2 focus:ring-2 focus:ring-green-400"
                    id={`investment-${proposal.id}`}
                  />
                  <button
                    onClick={() => {
                      const amount = document.getElementById(`investment-${proposal.id}`).value;
                      handleInterest(proposal.id, amount);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mt-2"
                  >
                    Show Interest
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 mt-6">No proposals available.</p>
      )}
    </div>
  );
};

export default Proposals;
