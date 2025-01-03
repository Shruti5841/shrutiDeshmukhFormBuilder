import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './FolderView.css';

const FolderView = () => {
  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { folderId } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    fetchFolderDetails();
  }, [folderId, token]);

  const fetchFolderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/folders/${folderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setFolder(data);
    } catch (error) {
      console.error('Error fetching folder details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!folder) return <div className="error">Folder not found</div>;

  return (
    <div className="folder-view-container">
      <div className="folder-header">
        <div className="folder-title">
          <h1>{folder.name}</h1>
          <span className="form-count">{folder.forms?.length || 0} forms</span>
        </div>
        <Link to="/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="forms-grid">
        {folder.forms?.map(form => (
          <div key={form._id} className="form-card">
            <div className="form-card-content">
              <h3>{form.title}</h3>
              <p>{form.description}</p>
              <div className="form-stats">
                <div className="stat">
                  <i className="fas fa-reply"></i>
                  <span>{form.submissions?.length || 0} responses</span>
                </div>
                <div className="stat">
                  <i className="fas fa-eye"></i>
                  <span>{form.views || 0} views</span>
                </div>
                <div className="stat">
                  <i className="fas fa-calendar"></i>
                  <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="form-actions">
              <Link to={`/form/${form._id}`} className="action-button view">
                View Form
              </Link>
              <Link to={`/submissions/${form._id}`} className="action-button responses">
                Responses
              </Link>
              <Link to={`/edit-form/${form._id}`} className="action-button edit">
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderView; 