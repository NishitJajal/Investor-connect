import { useState, useEffect, useContext } from "react";
import { db } from "../firebase/firebase";
import { AuthContext } from "../context/AuthContext";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const Proposals = () => {
  const { user, role } = useContext(AuthContext);
  const [proposals, setProposals] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterInvestment, setFilterInvestment] = useState("");

  // Fetch all proposals
  useEffect(() => {
    const fetchProposals = async () => {
      const querySnapshot = await getDocs(collection(db, "businessProposals"));
      setProposals(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProposals();
  }, []);

  // Filtered proposals based on category & investment amount
  const filteredProposals = proposals.filter((proposal) => {
    return (
      (!filterCategory || proposal.category === filterCategory) &&
      (!filterInvestment || proposal.requiredInvestment <= filterInvestment)
    );
  });

  // Investor expresses interest
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
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Business Proposals</h2>

      {/* Filters */}
      <div className="mb-6 flex space-x-4">
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border p-2">
          <option value="">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
          <option value="Education">Education</option>
        </select>

        <input type="number" placeholder="Max Investment" value={filterInvestment} onChange={(e) => setFilterInvestment(e.target.value)}
          className="border p-2"
        />
      </div>

      {/* List All Proposals */}
      {filteredProposals.length > 0 ? (
        filteredProposals.map(proposal => (
          <div key={proposal.id} className="border p-4 mb-4 rounded-md">
            <h3 className="text-xl font-bold">{proposal.title}</h3>
            <p>{proposal.description}</p>
            <p className="text-gray-600">Investment Required: ${proposal.requiredInvestment}</p>
            <p className="text-gray-600">Expected ROI: {proposal.expectedROI}%</p>
            <p className="text-gray-600">Category: {proposal.category}</p>

            {/* Show Interest Form (Only for Investors) */}
            {role === "Investor" && (
              <div className="mt-4">
                <input type="number" placeholder="Investment Amount" className="border p-2 mr-2"
                  id={`investment-${proposal.id}`}
                />
                <button onClick={() => {
                  const amount = document.getElementById(`investment-${proposal.id}`).value;
                  handleInterest(proposal.id, amount);
                }}
                  className="bg-green-500 text-white px-4 py-2 rounded">
                  Show Interest
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No proposals available.</p>
      )}
    </div>
  );
};

export default Proposals;
