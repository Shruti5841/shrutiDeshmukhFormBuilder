import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PieChart } from 'react-minimal-pie-chart';
import './FormResponses.css';

const FormResponses = () => {
  const [formData, setFormData] = useState(null);
  const [responses, setResponses] = useState([]);
  const [analytics, setAnalytics] = useState({
    views: 0,
    responses: 0,
    completed: 0,
    completionRate: 0
  });
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    fetchResponses();
  }, [id, token]);

  const fetchResponses = async () => {
    try {
      const response = await fetch(`https://shrutideshmukhformbuilderfinal.onrender.com/api/forms/${id}/responses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch responses');
      }

      const data = await response.json();
      setFormData(data.form);
      setResponses(data.responses);
      
      const completionRate = data.stats.responses > 0 
        ? Math.round((data.stats.completed / data.stats.responses) * 100) 
        : 0;

      setAnalytics({
        views: data.stats.views,
        responses: data.stats.responses,
        completed: data.stats.completed,
        completionRate
      });
    } catch (error) {
      console.error('Error fetching responses:', error);
      alert('Error loading responses. Please try again.');
    }
  };

  if (!formData) return <div className="loading">Loading...</div>;

  return (
    <div className="responses-container">
      <div className="responses-header">
        <div className="header-left">
          <Link to="/dashboard" className="back-link">← Back</Link>
          <h1>{formData.title}</h1>
        </div>
      </div>

      <div className="analytics-section">
        <div className="analytics-cards">
          <div className="analytics-card">
            <h3>Views</h3>
            <p className="number">{analytics.views}</p>
          </div>
          <div className="analytics-card">
            <h3>Responses</h3>
            <p className="number">{analytics.responses}</p>
          </div>
          <div className="analytics-card">
            <h3>Completed</h3>
            <p className="number">{analytics.completed}</p>
          </div>
          <div className="analytics-card completion-card">
            <h3>Completion rate</h3>
            <div className="completion-chart">
              <PieChart
                data={[
                  { value: analytics.completionRate, color: '#1a73e8' },
                  { value: 100 - analytics.completionRate, color: '#333' }
                ]}
                lineWidth={20}
                startAngle={-90}
                totalValue={100}
                label={({ dataEntry }) => `${Math.round(dataEntry.value)}%`}
                labelStyle={{
                  fontSize: '25px',
                  fill: '#fff',
                  fontWeight: 'bold'
                }}
                labelPosition={0}
                background="#333"
                rounded
                animate
              />
            </div>
          </div>
        </div>
      </div>

      <div className="responses-table">
        <table>
          <thead>
            <tr>
              <th>Submitted at</th>
              {formData.fields.map((field, index) => (
                <th key={index}>{field.label || `${field.type} ${index + 1}`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responses.length === 0 ? (
              <tr>
                <td colSpan={formData.fields.length + 1} className="no-responses">
                  No responses yet
                </td>
              </tr>
            ) : (
              responses.map((response, index) => (
                <tr key={index}>
                  <td>{new Date(response.createdAt).toLocaleString()}</td>
                  {formData.fields.map((field, fieldIndex) => (
                    <td key={fieldIndex}>
                      {renderResponseValue(response.answers[fieldIndex], field.type)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const renderResponseValue = (value, type) => {
  if (!value) return '-';
  
  switch (type.toLowerCase()) {
    case 'rating':
      return '⭐'.repeat(value);
    case 'image':
      return <img src={value} alt="Response" className="response-image" />;
    case 'buttons':
      return Array.isArray(value) ? value.join(', ') : value;
    default:
      return value;
  }
};

export default FormResponses; 