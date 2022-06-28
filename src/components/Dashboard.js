import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Todo from "./Todo";
function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      //  const q = query(
      //    collection(db, "users"),
      //   where("email", "===", user.email)
      //  );
      const q = query(
        collection(db, "todos"),
        where("email", "===", localStorage.getItem("list"))
      );
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      console.log("name", data);
    } catch (err) {
      console.log(err);
      // alert("An error occured while fetching user data");
    }
  };

  // if (user !== null) {
  //   user.providerData.forEach((users) => {
  //     console.log("Sign-in provider: " + users.providerId);
  //   });
  // }
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);
  return (
    <div className="dashboard">
      <div className="dashboard__container">
        Logged in as
        <div>{name}</div>
        <div>{user?.email}</div>
        <Todo />
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
export default Dashboard;
