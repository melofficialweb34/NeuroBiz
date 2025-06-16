import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../services/firebase";
import "../css/FormEditor.css";

const FormEditor = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    id: "",
    text: "",
    input_type: "short text",
    options: [],
    branching_logic: {},
  });
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editingOptionsFor, setEditingOptionsFor] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      const formRef = doc(db, "forms", formId);
      const snap = await getDoc(formRef);
      if (snap.exists()) {
        setForm(snap.data());
      }
    };

    fetchForm();
  }, [formId]);

  const saveTitle = async () => {
    setEditingTitle(false);
    const formRef = doc(db, "forms", formId);
    await updateDoc(formRef, { title: form.title });
  };

  const handleAddQuestion = async () => {   
    if (!newQuestion.id || !newQuestion.text) {
      alert("Please fill out Question ID and Text.");
      return;
    }
    if (form.questions.find((q) => q.id === newQuestion.id)) {
      alert("Question ID already exists.");
      return;
    }
    const updatedQuestions = [...form.questions, newQuestion];
    const formRef = doc(db, "forms", formId);
    await updateDoc(formRef, { questions: updatedQuestions });
    setForm({ ...form, questions: updatedQuestions });
    setNewQuestion({
      id: "",
      text: "",
      input_type: "short text",
      options: [],
      branching_logic: {},
    });
  };

  const handleQuestionTextChange = (id, newText) => {
    const updated = form.questions.map((q) => {
      return q.id === id ? { ...q, text: newText } : q;
    });
    setForm({ ...form, questions: updated });
  };

  const saveQuestionText = async () => {
    setEditingQuestionId(null);
    const formRef = doc(db, "forms", formId);
    await updateDoc(formRef, { questions: form.questions });
  };

  return (
    <div className="form-editor">
      {editingTitle ? (
        <input
          type="text"
          value={form.title}
          autoFocus
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          onBlur={saveTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveTitle();
          }}
          className="form-title-input"
        />
      ) : (
        <h2
          onClick={() => setEditingTitle(true)}
          className="form-title-display"
        >
          {form?.title || "Untitled form"}
        </h2>
      )}

      <div>
        <h3>Add New Question</h3>
        <input
          type="text"
          placeholder="Question Id (e.g. Q1.1)"
          value={newQuestion.id}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, id: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Question Text"
          value={newQuestion.text}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, text: e.target.value })
          }
        />
        <select
          value={newQuestion.input_type}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, input_type: e.target.value })
          }
        >
          <option>short text</option>
          <option>single choice</option>
          <option>multi select</option>
        </select>

        {/* Dynamic Option UI */}
        {["single choice", "multi select"].includes(newQuestion.input_type) && (
          <div className="option-group">
            <h4>Options:</h4>
            {newQuestion.options.map((opt, index) => {
              return (
                <div key={index}>
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={opt.text}
                    onChange={(e) => {
                      const updatedOptions = [...newQuestion.options];
                      updatedOptions[index].text = e.target.value;
                      setNewQuestion({
                        ...newQuestion,
                        options: updatedOptions,
                      });
                    }}
                  />

                  <input
                    type="text"
                    placeholder="Branching action (e.g., Go to Q2)"
                    value={opt.branching || ""}
                    onChange={(e) => {
                      const updatedOptions = [...newQuestion.options];
                      updatedOptions[index].branching = e.target.value;
                      setNewQuestion({
                        ...newQuestion,
                        options: updatedOptions,
                      });
                    }}
                  />

                  <button
                    onClick={() => {
                      const updatedOptions = newQuestion.options.filter(
                        (_, i) => i !== index
                      );
                      setNewQuestion({
                        ...newQuestion,
                        options: updatedOptions,
                      });
                    }}
                  >
                    Remove
                  </button>
                </div>
              );
            })}

            <button
              onClick={() => {
                setNewQuestion({
                  ...newQuestion,
                  options: [...newQuestion.options, { text: "", score: null }],
                });
              }}
            >
              Add Option
            </button>
          </div>
        )}

        <button onClick={handleAddQuestion}>Add Question</button>
      </div>

      <div>
        <h3>Existing Questions</h3>
        <ul className="question-list">
          {(form?.questions || []).map((q) => (
            <li key={q.id} className="question-item">
              <strong>{q.id}:</strong>
              {editingQuestionId === q.id ? (
                <input
                  type="text"
                  value={q.text}
                  autoFocus
                  onChange={(e) =>
                    handleQuestionTextChange(q.id, e.target.value)
                  }
                  onBlur={() => saveQuestionText(q.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveQuestionText(q.id);
                  }}
                />
              ) : (
                <span onClick={() => setEditingQuestionId(q.id)}>{q.text}</span>
              )}
              ({q.input_type})



              {/* EDIT OPTIONS BUTTON */}
              {["single choice", "multi choice"].includes(q.input_type) && (
                <>
                <button onClick={() => setEditingOptionsFor(q.id)}>
                  {editingOptionsFor === q.id ? "Done" : "Edit Options"}
                </button>
                </>
              )}


              {/* EDITABLE OPTIONS SECTION */}
              {editingOptionsFor === q.id && (
                <div className="options-edit-section">
                  {(q.options || []).map((opt, index) => (
                    <div key={index}>
                      <input type="text"
                      value={opt.text}
                      placeholder={`Option ${index + 1}`}
                      onChange={(e) => {
                        const updatedQs = form.questions.map((item) => (
                          item.id === q.id ? {
                            ...item,
                            options:item.options.map((o, i) => (
                              i === index ? { ...o, text: e.target.value } : o
                            ),
                          )
                          }
                          : item
                        ))
                        setForm({ ...form, questions: updatedQs })
                      }}
                      />
                      <input type="text"
                      value={opt.branching || ""}
                      placeholder="Branching (optional)"
                      onChange={(e) => {
                        const updatedQuestions = form.questions.map((item) => 
                        item.id === q.id
                        ? {
                          ...item,
                          options: item.options.map((o, i) => 
                          i === index
                          ? {...o, branching: e.target.value}
                          : o
                          ),
                        } : item
                        );
                        setForm({ ...form, questions: updatedQuestions })
                      }}
                       />


                       <button onClick={() => {
                        const updatedQuestions = form.questions.map((item) => 
                        item.id === q.id
                        ? {
                          ...item,
                          options: item.options.filter((_, i) => i== index),
                        }
                        : item
                      );
                      setForm({ ...form, questions: updatedQuestions })
                       }}>Remove</button>

                    </div>
                  ))}



                  <button onClick={() => {
                    const updatedQuestions = form.questions.map((item) => 
                      item.id === q.id
                    ? {
                      ...item,
                      options: [...(item.options || []), {text: "", score: null}],
                    }
                    : item
                    );
                    setForm({ ...form, questions: updatedQuestions })
                  }}>Add Option</button>



                  <button onClick={async () => {
                    const formRef = doc(db, "forms", formId)
                    await updateDoc(formRef, { questions: form.questions })
                    setEditingOptionsFor(null)
                  }}>Save Changes</button>



                </div>
              )}


            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FormEditor;
