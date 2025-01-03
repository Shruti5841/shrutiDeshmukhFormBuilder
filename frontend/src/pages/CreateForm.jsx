import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './CreateForm.css';

const FIELD_TYPES = {
  BUBBLES: {
    TEXT: { icon: '📝', label: 'Text', placeholder: 'Click to add link' },
    IMAGE: { icon: '🖼️', label: 'Image', placeholder: 'Click to upload image' },
    VIDEO: { icon: '🎥', label: 'Video', placeholder: 'Click to add video link' },
    GIF: { icon: 'GIF', label: 'GIF', placeholder: 'Search GIF' }
  },
  INPUTS: {
    TEXT: { icon: 'Aa', label: 'Text', placeholder: 'Enter text' },
    NUMBER: { icon: '123', label: 'Number', placeholder: 'Enter number' },
    EMAIL: { icon: '✉️', label: 'Email', placeholder: 'Enter email' },
    PHONE: { icon: '📱', label: 'Phone', placeholder: 'Enter phone number' },
    DATE: { icon: '📅', label: 'Date', placeholder: 'Select date' },
    RATING: { icon: '⭐', label: 'Rating', maxRating: 5 },
    BUTTONS: { icon: '🔘', label: 'Buttons' }
  }
};

const CreateForm = () => {
  const [formName, setFormName] = useState('');
  const [activeTab, setActiveTab] = useState('Flow');
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleAddField = (type, category) => {
    const newField = {
      id: Date.now().toString(),
      type,
      category,
      label: '',
      required: false,
      placeholder: FIELD_TYPES[category][type].placeholder || '',
      options: type === 'BUTTONS' ? ['Option 1'] : [],
      order: fields.length
    };
    setFields([...fields, newField]);
  };

  const handleFieldUpdate = (fieldId, updates) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const handleDeleteField = (fieldId) => {
    setFields(fields.filter(field => field.id !== fieldId));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property for each field
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setFields(updatedItems);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      alert('Please enter a form name');
      return;
    }

    try {
      const formattedFields = fields.map((field, index) => ({
        ...field,
        type: field.category === 'BUBBLES' ? field.type.toLowerCase() : field.type.toLowerCase(),
        order: index,
        id: undefined // Remove id before sending to server
      }));

      const response = await fetch('http://localhost:5000/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formName,
          fields: formattedFields
        })
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        const error = await response.json();
        alert(`Error creating form: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating form:', error);
      alert('Error creating form. Please try again.');
    }
  };

  const renderFieldInput = (field) => {
    switch (field.type) {
      case 'TEXT':
      case 'EMAIL':
      case 'PHONE':
      case 'NUMBER':
        return (
          <div className="field-input-container">
            <input
              type="text"
              placeholder={field.placeholder}
              className="field-preview-input"
              disabled
            />
          </div>
        );

      case 'DATE':
        return (
          <div className="field-input-container">
            <input
              type="date"
              className="field-preview-input"
              disabled
            />
          </div>
        );

      case 'RATING':
        return (
          <div className="rating-config">
            <span>Max Rating:</span>
            <select
              value={field.maxRating || 5}
              onChange={(e) => handleFieldUpdate(field.id, { maxRating: parseInt(e.target.value) })}
              className="rating-select"
            >
              {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <div className="rating-preview">
              {[...Array(field.maxRating || 5)].map((_, i) => (
                <span key={i} className="rating-star">⭐</span>
              ))}
            </div>
          </div>
        );

      case 'BUTTONS':
        return (
          <div className="button-options">
            {field.options.map((option, index) => (
              <div key={index} className="button-option">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...field.options];
                    newOptions[index] = e.target.value;
                    handleFieldUpdate(field.id, { options: newOptions });
                  }}
                  placeholder={`Option ${index + 1}`}
                />
                <button
                  onClick={() => {
                    const newOptions = field.options.filter((_, i) => i !== index);
                    handleFieldUpdate(field.id, { options: newOptions });
                  }}
                  className="remove-option"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newOptions = [...field.options, `Option ${field.options.length + 1}`];
                handleFieldUpdate(field.id, { options: newOptions });
              }}
              className="add-option-btn"
            >
              Add Option
            </button>
          </div>
        );

      case 'IMAGE':
      case 'VIDEO':
      case 'GIF':
        return (
          <div className="media-input-container">
            <input
              type="text"
              placeholder={field.placeholder}
              className="field-preview-input"
              value={field.url || ''}
              onChange={(e) => handleFieldUpdate(field.id, { url: e.target.value })}
            />
            {field.type === 'IMAGE' && field.url && (
              <div className="media-preview">
                <img src={field.url} alt="Preview" />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="form-builder-container">
      {/* Header */}
      <div className="builder-header">
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Enter Form Name"
          className="form-name-input"
        />
        <div className="header-tabs">
          <button 
            className={`tab ${activeTab === 'Flow' ? 'active' : ''}`}
            onClick={() => setActiveTab('Flow')}
          >
            Flow
          </button>
          <button 
            className={`tab ${activeTab === 'Response' ? 'active' : ''}`}
            onClick={() => setActiveTab('Response')}
          >
            Response
          </button>
        </div>
        <div className="header-actions">
          <button className="theme-toggle">
            Light
            <span className="toggle-slider"></span>
            Dark
          </button>
          <button className="share-btn">Share</button>
          <button className="save-btn" onClick={handleSave}>Save</button>
          <button className="close-btn">×</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="builder-content">
        {/* Left Sidebar - Field Types */}
        <div className="field-types-sidebar">
          <div className="field-category">
            <h3>Bubbles</h3>
            <div className="field-buttons">
              {Object.entries(FIELD_TYPES.BUBBLES).map(([type, { icon, label }]) => (
                <button
                  key={type}
                  className="field-type-btn"
                  onClick={() => handleAddField(type, 'BUBBLES')}
                >
                  <span className="field-icon">{icon}</span>
                  <span className="field-label">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="field-category">
            <h3>Inputs</h3>
            <div className="field-buttons">
              {Object.entries(FIELD_TYPES.INPUTS).map(([type, { icon, label }]) => (
                <button
                  key={type}
                  className="field-type-btn"
                  onClick={() => handleAddField(type, 'INPUTS')}
                >
                  <span className="field-icon">{icon}</span>
                  <span className="field-label">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Form Building Area */}
        <div className="form-building-area">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="fields-flow"
                >
                  {fields.length === 0 ? (
                    <div className="empty-state">
                      <div className="start-icon">▶️</div>
                      <p>Start</p>
                    </div>
                  ) : (
                    fields.map((field, index) => (
                      <Draggable
                        key={field.id}
                        draggableId={field.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="field-block"
                          >
                            <div className="field-content">
                              <div className="field-header">
                                <div {...provided.dragHandleProps} className="drag-handle">
                                  ⋮⋮
                                </div>
                                <span className="field-number">{index + 1}</span>
                                <span className="field-type">
                                  {FIELD_TYPES[field.category][field.type].label}
                                </span>
                                <div className="field-actions">
                                  <button onClick={() => handleDeleteField(field.id)}>
                                    🗑️
                                  </button>
                                </div>
                              </div>

                              <input
                                type="text"
                                placeholder="Enter field label"
                                value={field.label}
                                onChange={(e) => handleFieldUpdate(field.id, { label: e.target.value })}
                                className="field-label-input"
                              />

                              {/* Field-specific inputs */}
                              {renderFieldInput(field)}

                              <div className="field-settings">
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={field.required}
                                    onChange={(e) => handleFieldUpdate(field.id, { required: e.target.checked })}
                                  />
                                  Required
                                </label>
                              </div>
                            </div>
                            <div className="field-connector" />
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default CreateForm; 