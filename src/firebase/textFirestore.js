import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

const testFirestore = async () => {
  try {
    const docRef = await addDoc(collection(db, "testCollection"), {
      message: "Firestore is connected!",
      createdAt: new Date(),
    });
    console.log("Test document added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding document:", error);
  }
};

export default testFirestore;