import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../services/firebase';
import "../css/FormResponse.css"

const FormResponse = () => {
    const { formId } = useParams();
    const [form, setForm] = useState(null)
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchForm = async () => {
        const formRef = doc(db, "forms", formId)
        const snap = await getDoc(formRef);
        if(snap.exists()){
            setForm(snap.data())
        }
    };
    fetchForm()

    }, [formId])
    

    const handleChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value })
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        const responseRef = collection(db, "form_responses", formId, "responses")
        await addDoc(responseRef, {
            answers,
            submittedAt: new Date()
        })
        console.log("Submitted answers: ", answers)
        // You can add Firestore save logic here
        setAnswers({})
    }

if (!form) return <div>Loading form...</div>

  return (
    <div>
        <h2>{form.title}</h2>
        <form onSubmit={handleSubmit}>
            {form.questions.map((q) => {
                return(
                    <div key={q.id} className='question-block'>
                        <label>{q.text}</label>
                        {q.input_type === "short text" && (
                            <input
                            type='text' 
                            value={answers[q.id] || ""}
                            onChange={(e) => handleChange(q.id, e.target.value)}
                            />
                        )}
                        {q.input_type === "single choice" && (
                            q.options.map((opt, i ) => (
                                <div key={i}>
                                    <input
                                    type='radio'
                                    name={q.id}
                                    value={opt.text}
                                    checked={answers[q.id] === opt.text}
                                    onChange={(e) => handleChange(q.id, e.target.value)}
                                    />{opt.text}
                                    </div>
                            ))
                        )}


                        {q.input_type === 'multi-select' && (
                            q.options.map((opt, i) => (
                                <div key={i}>
                                    <input type="checkbox"
                                     checked={answers[q.id]?.includes(opt.text) || false}
                                     onChange={(e) => {
                                        const current = answers[q.id] || [];
                                        const updated = e.target.checked
                                        ? [...current, opt.text]
                                        : current.filter(val => val !== opt.text)

                                        handleChange(q.id, updated)
                                     }}
                                     />

                                </div>
                            ))
                        )}


                    </div>
                )
            })}
            <button type="submit">Submit</button>
        </form>
    </div>
  )
}

export default FormResponse