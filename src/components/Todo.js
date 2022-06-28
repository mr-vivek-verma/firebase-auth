import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { query, onSnapshot, where, orderBy } from "firebase/firestore";

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
      localStorage.setItem("list", currentUser.email);
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
      email: localStorage.getItem("list"),
    });
    setNewEmail("");
    console.log("data in db", setNewEmail);
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

  //  useEffect(() => {
  //  const getUsers = async () => {
  //     const data = await getDocs(userCollectionRef);
  //     setTodos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  //   };
  //   getUsers();
  // }, []);
  useEffect(() => {
    const getUsers = async () => {
      const user1 = localStorage.getItem("list");
      console.log(user1);
      const q = query(collection(db, "todo"), where("email", "==", user1));
      const unsub = onSnapshot(q, (QuerySnapshot) => {
        let todoArray = [];
        QuerySnapshot.forEach((doc) => {
          todoArray.push({ ...doc.data(), id: doc.id });
        });
        console.log("from vivek", todoArray);
        setTodos(todoArray);
      });
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
