import React from 'react'
import Question from './Question'

const FormRenderer = ({ data }) => {
  return (
    <div className='p-4'>
        <h2 className="text-2xl font-bold mb-4">{currentSection.section_title}</h2>
        {currentSection.questions.map(q => (
            <Question key={q.id} question={q} onChange={handleChange} />
        ))}
        <div className="flex justify-between mt-6">
            {}
        </div>
    </div>
  )
}

export default FormRenderer