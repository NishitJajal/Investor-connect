import { useState, useEffect, useContext } from "react";
import { db } from "../firebase/firebase";
import { AuthContext } from "../context/AuthContext";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";

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
    //   console.log("Updated Proposals:", updatedProposals);
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
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">My Business Proposals</h2>

      <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Create New Proposal
      </button>

      {showForm && (
        <form onSubmit={handleProposalSubmit} className="mb-6">
          <input type="text" placeholder="Proposal Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="border p-2 w-full mb-3" />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required className="border p-2 w-full mb-3" />
          <input type="number" placeholder="Required Investment" value={requiredInvestment} onChange={(e) => setRequiredInvestment(e.target.value)} required className="border p-2 w-full mb-3" />
          <input type="number" placeholder="Expected ROI (%)" value={expectedROI} onChange={(e) => setExpectedROI(e.target.value)} required className="border p-2 w-full mb-3" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 w-full mb-3">
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
          </select>
          <button type="submit" className="bg-green-500 text-white p-2 w-full">
            {editingProposal ? "Update Proposal" : "Create Proposal"}
          </button>
        </form>
      )}

      {proposals.length > 0 ? (
        proposals.map(proposal => (
          <div key={proposal.id} className="border p-4 mb-4 rounded-md">
            <h3 className="text-xl font-bold">{proposal.title}</h3>
            <p>{proposal.description}</p>
            <p className="text-gray-600">Investment Required: ${proposal.requiredInvestment}</p>
            <p className="text-gray-600">Expected ROI: {proposal.expectedROI}%</p>
            <button onClick={() => handleEditProposal(proposal)} className="bg-yellow-500 text-white px-4 py-2 mt-2 rounded">
              Edit
            </button>
            <button onClick={() => handleDeleteProposal(proposal.id)} className="bg-red-500 text-white px-4 py-2 mt-2 rounded ml-2">
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No proposals found.</p>
      )}
    </div>
  );
};  

export default MyProposals;