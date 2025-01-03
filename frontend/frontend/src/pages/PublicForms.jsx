import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PublicForms.css';

const PublicForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicForms = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://shrutideshmukhformbuilderfinal.onrender.com/api/forms/public');
        if (!response.ok) {
          throw new Error('Failed to fetch forms');
        }
        const data = await response.json();
        setForms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching public forms:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicForms();
  }, []);

  if (loading) return (
    <div className="public-forms-container">
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading forms...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="public-forms-container">
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h2>Error loading forms</h2>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="public-forms-container">
      <div className="public-forms-header">
        <h1>Available Forms</h1>
        <Link to="/create-form" className="create-form-button">
          Create Your Own Form
        </Link>
      </div>

      <div className="public-forms-content">
        {forms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h2>No forms available</h2>
            <p>Be the first to create a public form!</p>
            <Link to="/create-form" className="create-form-button">
              Create Form
            </Link>
          </div>
        ) : (
          <div className="forms-grid">
            {forms.map(form => (
              <div key={form._id} className="form-card">
                <div className="form-card-content">
                  <h3>{form.title}</h3>
                  <p>{form.description}</p>
                  <div className="form-meta">
                    <span className="creator">By: {form.creator?.name || 'Unknown'}</span>
                    <span className="created-date">
                      Created: {new Date(form.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="form-card-footer">
                  <Link to={`/form/${form._id}`} className="fill-form-button">
                    Fill Form
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="decorative-elements">
        <div className="pink-circle"></div>
        <div className="orange-circle"></div>
        <div className="blue-arc"></div>
      </div>
    </div>
  );
};

export default PublicForms; 