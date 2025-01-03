import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ViewSubmissions.css';

const ViewSubmissions = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formResponse, submissionsResponse] = await Promise.all([
          fetch(`https://shrutideshmukhformbuilderfinal.onrender.com/api/forms/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`https://shrutideshmukhformbuilderfinal.onrender.com/api/submissions/form/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const [formData, submissionsData] = await Promise.all([
          formResponse.json(),
          submissionsResponse.json()
        ]);

        setForm(formData);
        setSubmissions(submissionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id, token]);

  if (!form) return <div>Loading...</div>;

  return (
    <div className="view-submissions">
      <h1>Submissions for {form.title}</h1>
      <div className="submissions-table">
        <table>
          <thead>
            <tr>
              <th>Submission Date</th>
              {form.fields.map(field => (
                <th key={field._id}>{field.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {submissions.map(submission => (
              <tr key={submission._id}>
                <td>{new Date(submission.createdAt).toLocaleDateString()}</td>
                {form.fields.map(field => (
                  <td key={field._id}>
                    {submission.responses.find(r => r.fieldId === field._id)?.value || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewSubmissions; 