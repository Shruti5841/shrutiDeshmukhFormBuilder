import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './FormSubmission.css';

const FormSubmission = () => {
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      const response = await fetch(`https://shrutideshmukhformbuilderfinal.onrender.com/api/forms/${id}`);
      const data = await response.json();
      setForm(data);
      // Initialize answers object
      const initialAnswers = {};
      data.fields.forEach((field, index) => {
        initialAnswers[index] = field.type === 'buttons' ? [] : '';
      });
      setAnswers(initialAnswers);
    } catch (error) {
      console.error('Error fetching form:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      const answersArray = form.fields.map((field, index) => {
        if (field.type === 'image' || field.type === 'video') {
          return null; // Will be replaced with file URL after upload
        }
        return answers[index];
      });

      // Append files
      form.fields.forEach((field, index) => {
        if ((field.type === 'image' || field.type === 'video') && answers[index]) {
          formData.append('files', answers[index]);
        }
      });

      formData.append('answers', JSON.stringify(answersArray));

      const response = await fetch(`https://shrutideshmukhformbuilderfinal.onrender.com/api/forms/${id}/submit`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit form');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.message || 'Error submitting form. Please try again.');
    }
  };

  const handleInputChange = (index, value) => {
    setAnswers(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleFileChange = async (index, file) => {
    if (file) {
      setAnswers(prev => ({
        ...prev,
        [index]: file
      }));
    }
  };

  const renderField = (field, index) => {
    switch (field.type.toLowerCase()) {
      case 'text':
        return (
          <input
            type="text"
            value={answers[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder={field.placeholder || 'Enter text'}
            required={field.required}
            className="form-input"
          />
        );

      case 'email':
        return (
          <input
            type="email"
            value={answers[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder={field.placeholder || 'Enter email'}
            required={field.required}
            className="form-input"
          />
        );

      case 'phone':
        return (
          <input
            type="tel"
            value={answers[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder={field.placeholder || 'Enter phone number'}
            required={field.required}
            className="form-input"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={answers[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder={field.placeholder || 'Enter number'}
            required={field.required}
            className="form-input"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={answers[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            required={field.required}
            className="form-input date-input"
          />
        );

      case 'rating':
        return (
          <div className="rating-input">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleInputChange(index, i + 1)}
                className={`rating-star ${(answers[index] || 0) > i ? 'active' : ''}`}
              >
                ⭐
              </button>
            ))}
          </div>
        );

      case 'image':
        return (
          <div className="file-input-container">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(index, e.target.files[0])}
              required={field.required}
              className="file-input"
              id={`file-input-${index}`}
            />
            <label htmlFor={`file-input-${index}`} className="file-input-label">
              {answers[index] ? answers[index].name : 'Choose Image'}
            </label>
            {answers[index] && (
              <img
                src={URL.createObjectURL(answers[index])}
                alt="Preview"
                className="file-preview"
              />
            )}
          </div>
        );

      case 'video':
        return (
          <div className="file-input-container">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(index, e.target.files[0])}
              required={field.required}
              className="file-input"
              id={`file-input-${index}`}
            />
            <label htmlFor={`file-input-${index}`} className="file-input-label">
              {answers[index] ? answers[index].name : 'Choose Video'}
            </label>
            {answers[index] && (
              <video
                src={URL.createObjectURL(answers[index])}
                controls
                className="file-preview"
              />
            )}
          </div>
        );

      case 'buttons':
        return (
          <div className="buttons-input">
            {field.options.map((option, i) => (
              <label key={i} className="button-option">
                <input
                  type="checkbox"
                  checked={answers[index]?.includes(option)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...(answers[index] || []), option]
                      : (answers[index] || []).filter(v => v !== option);
                    handleInputChange(index, newValue);
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (!form) return <div className="loading">Loading...</div>;
  if (submitted) return (
    <div className="submission-success">
      <h2>Thank you!</h2>
      <p>Your response has been recorded.</p>
    </div>
  );

  return (
    <div className="form-submission-container">
      <h1>{form.title}</h1>
      <form onSubmit={handleSubmit}>
        {form.fields.map((field, index) => (
          <div key={index} className="field-container">
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            {renderField(field, index)}
          </div>
        ))}
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default FormSubmission; 