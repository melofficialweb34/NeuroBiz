import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  Query,
  QuerySnapshot,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { QRCodeCanvas } from "qrcode.react";

import "../css/AdminPanel.css";

const AdminPanel = () => {
  const [forms, setForms] = useState([]);
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "questions"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setQuestions(data);
    });

    return () => unsubscribe(); // cleanup listerner
  }, []);

  const fetchForms = async () => {
    const snapshot = await getDocs(collection(db, "forms"));
    const formList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setForms(formList);
  };

  const createForm = async () => {
    const docRef = await addDoc(collection(db, "forms"), {
      title: "Untitled Form",
      questions: [],
    });
    navigate(`/edit/${docRef.id}`);
  };

  const deleteForm = async (id) => {
    await deleteDoc(doc(db, "forms", id));
    fetchForms();
  };
  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Panel</h2>
      <button onClick={createForm} className="create-btn">
        Create New Form
      </button>
      <div className="form-list">
        {forms.map((form) => (
          <div key={form.id} className="form-card">
            <h3 className="form-title">{form.title || "Untitled Form"}</h3>
            <div className="form-actions">
              <button onClick={() => navigate(`/edit/${form.id}`)}>Edit</button>
              <button onClick={() => deleteForm(form.id)}>Delete</button>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/form/respond/${form.id}`
                  )
                }
              >
                Copy Form Link
              </button>
              
              {/* QR Code */}
                <div className="qr-code">
                    <QRCodeCanvas value={`${window.location.origin}/form/respond/${form.id}`} size={128} />
                    <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>Scan to open</p>
                </div>

              <Link to={`/responsedashboard/${form.id}`}>
                <button>View Responses</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
