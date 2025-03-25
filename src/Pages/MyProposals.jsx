import { useState, useEffect, useContext } from "react";
import { db } from "../firebase/firebase";
import { AuthContext } from "../context/AuthContext";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";

const MyProposals = () => {
  const { user, role } = useContext(AuthContext);
  const [proposals, setProposals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProposal, setEditingProposal] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredInvestment, setRequiredInvestment] = useState("");
  const [expectedROI, setExpectedROI] = useState("");
  const [category, setCategory] = useState("Technology");

  useEffect(() => {
    if (!user || role !== "BusinessPerson") return;

    const q = query(collection(db, "businessProposals"), where("createdBy", "==", user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedProposals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProposals(updatedProposals);
    });

    return () => unsubscribe();
  }, [user, role]);

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !requiredInvestment || !expectedROI) return;

    try {
      if (editingProposal) {
        await updateDoc(doc(db, "businessProposals", editingProposal.id), {
          title,
          description,
          requiredInvestment: Number(requiredInvestment),
          expectedROI: Number(expectedROI),
          category
        });
        alert("Proposal updated successfully!");
      } else {
        await addDoc(collection(db, "businessProposals"), {
          title,
          description,
          requiredInvestment: Number(requiredInvestment),
          expectedROI: Number(expectedROI),
          category,
          createdBy: user.uid,
          createdAt: new Date(),
        });
        alert("Proposal created successfully!");
      }

      setTitle("");
      setDescription("");
      setRequiredInvestment("");
      setExpectedROI("");
      setCategory("Technology");
      setEditingProposal(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving proposal:", error);
    }
  };

  const handleEditProposal = (proposal) => {
    setEditingProposal(proposal);
    setTitle(proposal.title);
    setDescription(proposal.description);
    setRequiredInvestment(proposal.requiredInvestment);
    setExpectedROI(proposal.expectedROI);
    setCategory(proposal.category);
    setShowForm(true);
  };

  const handleDeleteProposal = async (proposalId) => {
    try {
      await deleteDoc(doc(db, "businessProposals", proposalId));
      setProposals(proposals.filter(p => p.id !== proposalId));
    } catch (error) {
      console.error("Error deleting proposal:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-gradient-to-r from-blue-100 to-white-50 shadow-lg rounded-xl">
      <motion.h2
        className="text-4xl font-bold mb-8 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        My Business Proposals
      </motion.h2>

      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition mb-6"
      >
        Create New Proposal
      </button>

      {showForm && (
        <motion.form
          onSubmit={handleProposalSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <input
            type="text"
            placeholder="Proposal Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-3 w-full mb-4 rounded-lg"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border p-3 w-full mb-4 rounded-lg"
          />
          <input
            type="number"
            placeholder="Required Investment"
            value={requiredInvestment}
            onChange={(e) => setRequiredInvestment(e.target.value)}
            required
            className="border p-3 w-full mb-4 rounded-lg"
          />
          <input
            type="number"
            placeholder="Expected ROI (%)"
            value={expectedROI}
            onChange={(e) => setExpectedROI(e.target.value)}
            required
            className="border p-3 w-full mb-4 rounded-lg"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-3 w-full mb-4 rounded-lg"
          >
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
          </select>
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition w-full"
          >
            {editingProposal ? "Update Proposal" : "Create Proposal"}
          </button>
        </motion.form>
      )}

      {proposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proposals.map((proposal) => (
            <motion.div
              key={proposal.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{proposal.title}</h3>
              <p className="text-gray-700 mb-2">{proposal.description}</p>
              <p className="text-gray-600">Investment Required: ${proposal.requiredInvestment}</p>
              <p className="text-gray-600">Expected ROI: {proposal.expectedROI}%</p>
              <button onClick={() => handleEditProposal(proposal)} className="bg-yellow-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-yellow-600">
                Edit
              </button>
              <button onClick={() => handleDeleteProposal(proposal.id)} className="bg-red-500 text-white px-4 py-2 mt-4 ml-2 rounded-lg hover:bg-red-600">
                Delete
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <p>No proposals found.</p>
      )}
    </div>
  );
};

export default MyProposals;
