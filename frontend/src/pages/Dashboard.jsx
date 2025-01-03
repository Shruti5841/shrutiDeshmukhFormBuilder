import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFolders();
    fetchForms();
  }, [token]);

  const fetchFolders = async () => {
    try {
      const response = await fetch('https://shrutideshmukhformbuilderfinal.onrender.com/api/folders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchForms = async () => {
    try {
      const response = await fetch('https://shrutideshmukhformbuilderfinal.onrender.com/api/forms', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setForms(data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  const handleCreateFolder = async () => {
    try {
      const response = await fetch('https://shrutideshmukhformbuilderfinal.onrender.com/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newFolderName
        })
      });
      if (response.ok) {
        fetchFolders();
        setShowCreateFolderModal(false);
        setNewFolderName('');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      const response = await fetch(`https://shrutideshmukhformbuilderfinal.onrender.com/api/folders/${folderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchFolders();
        setShowDeleteModal(false);
        setFolderToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const addFormToFolder = async (formId, folderId) => {
    try {
      const response = await fetch(`https://shrutideshmukhformbuilderfinal.onrender.com/api/folders/${folderId}/forms/${formId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchFolders();
      }
    } catch (error) {
      console.error('Error adding form to folder:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="workspace-header">
        <div className="workspace-title">
          <h1>Your workspace</h1>
          <div className="theme-toggle">
            <span>Light</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
            <span>Dark</span>
          </div>
        </div>
        <button className="share-button">Share</button>
      </div>

      <div className="dashboard-actions">
        <button 
          className="create-folder-btn"
          onClick={() => setShowCreateFolderModal(true)}
        >
          <span className="icon">+</span> Create a folder
        </button>
        <Link to="/create-form" className="create-form-btn">
          <span className="icon">+</span> Create Form
        </Link>
      </div>

      {/* Folders Section */}
      <div className="section">
        <h2>Folders</h2>
        <div className="folders-grid">
          {folders.map(folder => (
            <div 
              key={folder._id} 
              className="folder-card"
              onClick={() => navigate(`/folder/${folder._id}`)}
            >
              <div className="folder-header">
                <h3>{folder.name}</h3>
                <div className="folder-actions">
                  <button onClick={() => setSelectedFolder(folder)}>
                    <i className="fas fa-folder-open"></i>
                  </button>
                  <button onClick={() => {
                    setFolderToDelete(folder);
                    setShowDeleteModal(true);
                  }}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <div className="folder-forms">
                {folder.forms?.map(form => (
                  <div key={form._id} className="folder-form-item">
                    <span>{form.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forms Section */}
      <div className="section">
        <h2>All Forms</h2>
        <div className="forms-grid">
          {forms.map(form => (
            <div key={form._id} className="form-card">
              <div className="form-card-content">
                <h3>{form.title}</h3>
                <p>{form.description}</p>
                <div className="form-stats">
                  <span>Responses: {form.submissions?.length || 0}</span>
                  <span>Created: {new Date(form.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="form-actions">
                <div className="action-buttons">
                  <Link to={`/form/${form._id}`} className="action-button view">
                    View
                  </Link>
                  <Link to={`/form-responses/${form._id}`} className="action-button responses">
                    Responses
                  </Link>
                  <Link to={`/edit-form/${form._id}`} className="action-button edit">
                    Edit
                  </Link>
                </div>
                <select 
                  className="folder-select"
                  onChange={(e) => addFormToFolder(form._id, e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Add to folder</option>
                  {folders.map(folder => (
                    <option key={folder._id} value={folder._id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Folder Modal */}
      {showCreateFolderModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Folder</h2>
            <input 
              type="text" 
              placeholder="Enter folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={() => {
                setShowCreateFolderModal(false);
                setNewFolderName('');
              }}>
                Cancel
              </button>
              <button 
                className="primary"
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete this folder?</h2>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button 
                className="danger"
                onClick={() => handleDeleteFolder(folderToDelete._id)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 