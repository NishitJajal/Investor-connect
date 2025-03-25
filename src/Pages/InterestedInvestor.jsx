import { useState, useEffect, useContext } from "react";
import { db } from "../firebase/firebase";
import { AuthContext } from "../context/AuthContext";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";

const InterestedInvestors = () => {
  const { user, role } = useContext(AuthContext);
  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    if (!user || role !== "BusinessPerson") return;

    const fetchInvestors = async () => {
      try {
        // Fetch all proposals created by the logged-in business owner
        const proposalsQuery = query(collection(db, "businessProposals"), where("createdBy", "==", user.uid));
        const proposalDocs = await getDocs(proposalsQuery);

        const proposalMap = proposalDocs.docs.reduce((acc, proposalDoc) => {
          acc[proposalDoc.id] = proposalDoc.data().title; // Map proposalId to business title
          return acc;
        }, {});

        const proposalIds = Object.keys(proposalMap);
        if (proposalIds.length === 0) {
          setInvestors([]);
          return;
        }

        // Fetch all interested investors related to these proposals
        const investorQuery = query(collection(db, "investorInterests"), where("proposalId", "in", proposalIds));
        const investorDocs = await getDocs(investorQuery);

        const investorData = await Promise.all(
          investorDocs.docs.map(async (investorDoc) => {
            const investorInfo = investorDoc.data();

            // Fetch investor details from "users" collection
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
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Interested Investors</h2>

      {investors.length > 0 ? (
        investors.map((investor, index) => (
          <div key={index} className="border p-4 mb-4 rounded-md">
            <h3 className="text-lg font-bold">{investor.investorName}</h3>
            <p className="text-gray-700">Email: {investor.investorEmail}</p>
            <p className="text-gray-600">Investment Amount: ${investor.investmentAmount}</p>
            <p className="text-indigo-600">Business Title: {investor.businessTitle}</p>
          </div>
        ))
      ) : (
        <p>No investors have shown interest yet.</p>
      )}
    </div>
  );
};

export default InterestedInvestors;
