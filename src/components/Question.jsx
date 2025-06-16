import React from 'react'

const Question = ({ question, onChange }) => {

    const handleSingle = () => {
        const val = e.target.value;
        const opt = question.options?.find(o => o.text === val);
        onChange(question.id, val, opt?.score || 0)
    }

    const handleMulti = (e) => {
        const selected = Array.from(e.target.selectedOptions).map(o => o.value)
        const totalScore = question.options?.filter(o => selected.includes(o.text)).reduce((s, o) => s + (o.score || 0), 0);
        onChange(question.id, val, opt?.score || 0)
    }

  return (
    <>
    <div className="container mb-4">
        <label className="question font-medium">{question.text}</label>
        {question.input_type === "short text" && (
            <input type="text" onBlur={e => onChange(question.id, e.target.value, 0)} className='w-full p-2 border mt-1'/>
        )}
        {question.input_type === "single choice" && (
            <select onChange={handleSingle} className='w-full p-2 border mt-1'>
                <option value="">--- Select ---</option>
                {question.options?.map(opt => (
                    <option key={opt.text} value={opt.text}>{opt.text}</option>
                ))}
            </select>
        )}
        {question.input_type === "multi-select" && (
            <select multiple onChange={handleSubmit} className='w-full p-2 border mt-1'>
                {question.options?.map(opt => (
                    <option key={opt.text} value={opt.text}>{opt.text}</option>
                ))}
            </select>
        )}
    </div>
    </>
  )
}

export default Question