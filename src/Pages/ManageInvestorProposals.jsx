import { useState, useEffect, useContext } from "react";
import { db } from "../firebase/firebase";
import { AuthContext } from "../context/AuthContext";
import { collection, getDocs, query, where, doc, getDoc, deleteDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const ManageInvestorProposals = () => {
  const { user, role } = useContext(AuthContext);
  const [investorProposals, setInvestorProposals] = useState([]);

  useEffect(() => {
    if (!user || role !== "Investor") return;

    const fetchInvestorProposals = async () => {
      try {
        const interestQuery = query(collection(db, "investorInterests"), where("investorId", "==", user.uid));
        const interestDocs = await getDocs(interestQuery);

        if (interestDocs.empty) {
          setInvestorProposals([]);
          return;
        }

        const proposalData = await Promise.all(
          interestDocs.docs.map(async (docSnapshot) => {
            const interestData = docSnapshot.data();
            const proposalDoc = await getDoc(doc(db, "businessProposals", interestData.proposalId));

            return {
              id: docSnapshot.id,
              ...interestData,
              businessTitle: proposalDoc.exists() ? proposalDoc.data().title : "Unknown Business",
            };
          })
        );

        setInvestorProposals(proposalData);
      } catch (error) {
        console.error("Error fetching investor proposals:", error);
      }
    };

    fetchInvestorProposals();
  }, [user, role]);

  const handleDeleteOffer = async (offerId) => {
    if (!offerId) return;

    try {
      await deleteDoc(doc(db, "investorInterests", offerId));
      setInvestorProposals((prev) => prev.filter((offer) => offer.id !== offerId));
      alert("Offer deleted successfully!");
    } catch (error) {
      console.error("Error deleting offer:", error);
      alert("Failed to delete offer. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-gradient-to-r from-blue-50 to-white-50 shadow-lg rounded-xl">
      <motion.h2
        className="text-4xl font-semibold mb-8 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Manage Your Investment Offers
      </motion.h2>

      {investorProposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {investorProposals.map((offer) => (
            <motion.div
              key={offer.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{offer.businessTitle}</h3>
              <p className="text-gray-700 font-medium mb-4">Investment Amount: ${offer.investmentAmount}</p>
              <button
                onClick={() => handleDeleteOffer(offer.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete Offer
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-lg mt-6">No investment offers found.</p>
      )}
    </div>
  );
};

export default ManageInvestorProposals;