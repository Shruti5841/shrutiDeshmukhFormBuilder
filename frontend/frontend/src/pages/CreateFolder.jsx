import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './CreateFolder.css';

const CreateFolder = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#1a73e8');
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
          color
        })
      });

      if (response.ok) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  return (
    <div className="create-folder-container">
      <div className="create-folder-header">
        <h1>Create New Folder</h1>
      </div>

      <div className="create-folder-content">
        <form onSubmit={handleSubmit} className="folder-form">
          <div className="form-group">
            <label>Folder Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter folder description"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Folder Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="color-picker"
            />
          </div>
          <button type="submit" className="submit-button">
            Create Folder
          </button>
        </form>
      </div>

      <div className="decorative-elements">
        <div className="pink-circle"></div>
        <div className="orange-circle"></div>
        <div className="blue-arc"></div>
      </div>
    </div>
  );
};

export default CreateFolder; 