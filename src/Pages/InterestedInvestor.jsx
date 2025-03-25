import { useState, useEffect, useContext } from "react";
import { db } from "../firebase/firebase";
import { AuthContext } from "../context/AuthContext";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const InterestedInvestors = () => {
  const { user, role } = useContext(AuthContext);
  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    if (!user || role !== "BusinessPerson") return;

    const fetchInvestors = async () => {
      try {
        const proposalsQuery = query(collection(db, "businessProposals"), where("createdBy", "==", user.uid));
        const proposalDocs = await getDocs(proposalsQuery);

        const proposalMap = proposalDocs.docs.reduce((acc, proposalDoc) => {
          acc[proposalDoc.id] = proposalDoc.data().title;
          return acc;
        }, {});

        const proposalIds = Object.keys(proposalMap);
        if (proposalIds.length === 0) {
          setInvestors([]);
          return;
        }

        const investorQuery = query(collection(db, "investorInterests"), where("proposalId", "in", proposalIds));
        const investorDocs = await getDocs(investorQuery);

        const investorData = await Promise.all(
          investorDocs.docs.map(async (investorDoc) => {
            const investorInfo = investorDoc.data();

            const investorUserDoc = await getDoc(doc(db, "users", investorInfo.investorId));

            return {
              ...investorInfo,
              investorName: investorUserDoc.exists() ? investorUserDoc.data().name : "Unknown Investor",
              investorEmail: investorUserDoc.exists() ? investorUserDoc.data().email : "No email available",
              businessTitle: proposalMap[investorInfo.proposalId] || "Unknown Proposal",
            };
          })
        );

        setInvestors(investorData);
      } catch (error) {
        console.error("Error fetching interested investors:", error);
      }
    };

    fetchInvestors();
  }, [user, role]);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-gradient-to-r from-blue-50 to-white-50 shadow-lg rounded-xl">
      <motion.h2
        className="text-4xl font-bold mb-8 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Interested Investors
      </motion.h2>

      {investors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {investors.map((investor, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{investor.investorName}</h3>
              <p className="text-gray-700 font-medium mb-2">Email: {investor.investorEmail}</p>
              <p className="text-gray-700 font-medium mb-2">Investment Amount: ${investor.investmentAmount}</p>
              <p className="text-indigo-600 font-semibold">Business Title: {investor.businessTitle}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-lg mt-6">No investors have shown interest yet.</p>
      )}
    </div>
  );
};

export default InterestedInvestors;