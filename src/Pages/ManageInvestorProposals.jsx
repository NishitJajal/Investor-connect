import { useState, useEffect, useContext } from "react";
import { db } from "../firebase/firebase";
import { AuthContext } from "../context/AuthContext";
import { collection, getDocs, query, where, doc, getDoc, deleteDoc } from "firebase/firestore";

const ManageInvestorProposals = () => {
  const { user, role } = useContext(AuthContext);
  const [investorProposals, setInvestorProposals] = useState([]);

  // Fetch proposals where the logged-in investor has shown interest
  useEffect(() => {
    if (!user || role !== "Investor") return;

    const fetchInvestorProposals = async () => {
      try {
        // Fetch all interests by the logged-in investor
        const interestQuery = query(collection(db, "investorInterests"), where("investorId", "==", user.uid));
        const interestDocs = await getDocs(interestQuery);

        if (interestDocs.empty) {
          setInvestorProposals([]);
          return;
        }

        const proposalData = await Promise.all(
          interestDocs.docs.map(async (docSnapshot) => {
            const interestData = docSnapshot.data();

            // Fetch proposal details from "businessProposals" collection
            const proposalDoc = await getDoc(doc(db, "businessProposals", interestData.proposalId));

            return {
              id: docSnapshot.id, // investorInterests document ID (for deletion)
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

  // Function to delete an offer (interest)
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
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6">Manage Your Investment Offers</h2>

      {investorProposals.length > 0 ? (
        investorProposals.map((offer) => (
          <div key={offer.id} className="border p-4 mb-4 rounded-md">
            <h3 className="text-lg font-semibold">{offer.businessTitle}</h3>
            <p className="text-gray-700">Investment Amount: ${offer.investmentAmount}</p>
            <button
              onClick={() => handleDeleteOffer(offer.id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Offer
            </button>
          </div>
        ))
      ) : (
        <p>No investment offers found.</p>
      )}
    </div>
  );
};

export default ManageInvestorProposals;