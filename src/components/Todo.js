import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function Todo() {
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState(0);

  const [users, setUsers] = useState([]);
  const userCollectionRef = collection(db, "users");
  const createUser = async () => {
    await addDoc(userCollectionRef, { name: newName, age: Number(newAge) });
  };

  const updateUser = async (id, age) => {
    const userDoc = doc(db, "users", id);
    const newFields = { age: age + 1 };
    await updateDoc(userDoc, newFields);
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, []);
  return (
    <div className="App">
      <input
        type="text"
        placeholder="Name"
        onChange={(e) => {
          setNewName(e.target.value);
        }}
      />
      <input
        type="number"
        placeholder="Age"
        onChange={(e) => {
          setNewAge(e.target.value);
        }}
      />
      <button onClick={createUser}>Create users</button>
      {users.map((users) => {
        return (
          <div>
            <h1>Name:{users.name}</h1>
            <h1>Age:{users.age}</h1>
            <button
              onClick={() => {
                updateUser(users.id, users.age);
              }}
            >
              Increase Age
            </button>
            <button
              onClick={() => {
                deleteUser(users.id);
              }}
            >
              deleteUser
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Todo;
