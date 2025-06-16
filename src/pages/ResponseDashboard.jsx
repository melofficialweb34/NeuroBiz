import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../services/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import "../css/ResponseDashboard.css"

const ResponseDashboard = () => {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [formTitle, setFormTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      //Get form title
      const formRef = doc(db, "forms", formId);
      const formSnap = await getDoc(formRef);
      if (formSnap.exists()) {
        setFormTitle(formSnap.data().title || "Untitled form");
      }

      // get all responses from sub collection
      const responsesRef = collection(
        db,
        "form_responses",
        formId,
        "responses"
      );
      const snap = await getDocs(responsesRef);
      const responseList = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResponses(responseList);
      console.log(responseList);
    };

    fetchData();
  }, [formId]);

  return (
    <div className="response-dashboard">
      <h2>Responses to: {formTitle}</h2>
      {responses.length === 0 ? (
        <p>No responses submitted yet</p>
      ) : (
        <div className="responses-list">
  {responses.map((res, index) => (
    <div key={res.id} className="response-card">
      <h4>Response #{index + 1}</h4>
      <ul>
        {res.answers && Object.entries(res.answers).map(
          ([questionId, answer]) => (
            <li key={questionId}>
              <strong>{questionId}</strong>:
              <span className="answer">
                {Array.isArray(answer)
                  ? answer.map((item, idx) => (
                      <span key={idx} className="tag">{item}</span>
                    ))
                  : typeof answer === "object"
                  ? JSON.stringify(answer)
                  : <span className="tag">{answer}</span>}
              </span>
            </li>
          )
        )}
      </ul>
    </div>
  ))}
</div>

      )}
    </div>
  );
};

export default ResponseDashboard;
