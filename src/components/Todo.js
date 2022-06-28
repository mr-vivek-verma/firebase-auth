import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";

function Todo() {
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState(0);
  const [newEmail, setNewEmail] = useState(0);

  useEffect(() => {
    let unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(currentUser);
      setNewEmail(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const [todos, setTodos] = useState([]);
  const userCollectionRef = collection(db, "todos");
  const createUser = async () => {
    await addDoc(userCollectionRef, {
      name: newName,
      age: Number(newAge),
      // email: `${email.email}`,
      email: `${newEmail}`,
    });
  };

  const updateUser = async (id, age) => {
    const userDoc = doc(db, "todos", id);
    const newFields = { age: age + 1 };
    await updateDoc(userDoc, newFields);
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "todos", id);
    await deleteDoc(userDoc);
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setTodos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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
      <button onClick={createUser}>Create todo list</button>
      {todos.map((todos) => {
        return (
          <div>
            <h1>Name:{todos.name}</h1>
            <h1>Age:{todos.age}</h1>
            <button
              onClick={() => {
                updateUser(todos.id, todos.age);
              }}
            >
              Increase Age
            </button>
            <button
              onClick={() => {
                deleteUser(todos.id);
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
