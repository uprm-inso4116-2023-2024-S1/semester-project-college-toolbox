import React, { useState, useEffect } from 'react';
import ScholarshipCard from './ScholarshipCard';
import './ScholarshipList.css'; // Import your CSS file

const defaultScholarships = [
  {
    id: 1,
    scholarship_name: 'Default Scholarship 1',
    applicationStatus: 'Accepted',
    applicantResume: 'John_Doe_Resume.pdf',
    applicationDeadline: '2023-12-31',
  },
  {
    id: 2,
    scholarship_name: 'Default Scholarship 2',
    applicationStatus: 'Denied',
    applicantResume: 'Jane_Smith_Resume.pdf',
    applicationDeadline: '2023-11-30',
  },
];

const ScholarshipList = () => {
  const [newScholarship, setNewScholarship] = useState({
    name: '',
    status: 'Waiting',
    resume: '',
    deadline: '',
  });

  const [allScholarships, setAllScholarships] = useState(defaultScholarships);
  const [isAddingScholarship, setIsAddingScholarship] = useState(false);
  const [removeConfirmation, setRemoveConfirmation] = useState(null); // State to manage remove confirmation

  // Function to calculate scholarship counters
  const calculateCounters = () => {
    const total = allScholarships.length;
    const accepted = allScholarships.filter((scholarship) => scholarship.applicationStatus === 'Accepted').length;
    const denied = allScholarships.filter((scholarship) => scholarship.applicationStatus === 'Denied').length;
    const waiting = allScholarships.filter((scholarship) => scholarship.applicationStatus === 'Waiting').length;
    return { total, accepted, denied, waiting };
  };

  // Initialize counters
  const [scholarshipCounters, setScholarshipCounters] = useState(calculateCounters());

  // Function to update the counters
  const updateCounters = (newScholarships) => {
    const total = newScholarships.length;
    const accepted = newScholarships.filter((scholarship) => scholarship.applicationStatus === 'Accepted').length;
    const denied = newScholarships.filter((scholarship) => scholarship.applicationStatus === 'Denied').length;
    const waiting = newScholarships.filter((scholarship) => scholarship.applicationStatus === 'Waiting').length;
    setScholarshipCounters({ total, accepted, denied, waiting });
  };

  useEffect(() => {
    const accepted = allScholarships.filter((scholarship) => scholarship.applicationStatus === 'Accepted').length;
    const denied = allScholarships.filter((scholarship) => scholarship.applicationStatus === 'Denied').length;
    const waiting = allScholarships.filter((scholarship) => scholarship.applicationStatus === 'Waiting').length;
    
    setScholarshipCounters((prevCounters) => ({
      ...prevCounters,
      accepted,
      denied,
      waiting,
    }));
  }, [allScholarships]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewScholarship({
      ...newScholarship,
      [name]: value,
    });
  };

  const handleAddScholarship = () => {
    // Create a new scholarship object from newScholarship state
    const scholarshipToAdd = {
      id: allScholarships.length + 1,
      ...newScholarship,
    };

    // Update the list of all scholarships
    const updatedScholarships = [...allScholarships, scholarshipToAdd];
    setAllScholarships(updatedScholarships);

    // Reset the form fields
    setNewScholarship({
      name: '',
      status: 'Waiting',
      resume: '',
      deadline: '',
    });

    // Update the counters
    const accepted = updatedScholarships.filter((scholarship) => scholarship.applicationStatus === 'Accepted').length;
    const denied = updatedScholarships.filter((scholarship) => scholarship.applicationStatus === 'Denied').length;
    const waiting = updatedScholarships.filter((scholarship) => scholarship.applicationStatus === 'Waiting').length;
    setScholarshipCounters({
      total: updatedScholarships.length,
      accepted,
      denied,
      waiting,
    });

    // Exit the scholarship addition mode
    setIsAddingScholarship(false);
    updateCounters(updatedScholarships);
  };


  const showRemoveConfirmation = (id) => {
    // Show the remove confirmation dialog
    setRemoveConfirmation(id);
  };

  const handleRemoveScholarship = (id) => {
    // Filter out the scholarship with the given ID
    const updatedScholarships = allScholarships.filter(
      (scholarship) => scholarship.id !== id
    );

    // Update the list of all scholarships
    setAllScholarships(updatedScholarships);

    // Close the remove confirmation dialog
    setRemoveConfirmation(null);

    // Update the counters
    updateCounters(updatedScholarships);
  };

  const cancelRemove = () => {
    // Close the remove confirmation dialog without removing the scholarship
    setRemoveConfirmation(null);
  };

  const handleCancelAddition = () => {
    // Reset the form fields
    setNewScholarship({
      name: '',
      status: 'Waiting',
      resume: '',
      deadline: '',
    });

    // Exit the scholarship addition mode
    setIsAddingScholarship(false);
  };

  return (
    <div style={{ paddingLeft: '20px' }}>
      <div className="counter-section">
        <span className="counter-item">Total Scholarships: {scholarshipCounters.total}</span>
        <span className="counter-item">Accepted: {scholarshipCounters.accepted}</span>
        <span className="counter-item">Denied: {scholarshipCounters.denied}</span>
        <span className="counter-item">Waiting: {scholarshipCounters.waiting}</span>
      </div>
      {/* Add Scholarship Form */}
      {isAddingScholarship ? (
        <div className="add-scholarship-section">
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newScholarship.name}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
          <div>
            <label>Status:</label>
            <select
              name="status"
              value={newScholarship.status}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="Accepted">Accepted</option>
              <option value="Denied">Denied</option>
              <option value="Waiting">Waiting</option>
            </select>
          </div>
          <div>
            <label>Resume:</label>
            <input
              type="file"
              accept=".pdf"
              name="resume"
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
          <div>
            <label>Deadline:</label>
            <input
              type="date"
              name="deadline"
              value={newScholarship.deadline}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <button onClick={handleAddScholarship} className="add-button">
            Submit Scholarship
          </button>
          <button onClick={handleCancelAddition} className="cancel-button">
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={() => setIsAddingScholarship(true)}>
          Add Scholarship
        </button>
      )}

      {allScholarships.map((scholarship) => (
        <div key={scholarship.id} className="scholarship-card">
          <ScholarshipCard
            scholarship_name={scholarship.name}
            applicationStatus={scholarship.status}
            applicantResume={scholarship.resume}
            applicationDeadline={scholarship.deadline}
            {...scholarship}
          />
          <button
            onClick={() => showRemoveConfirmation(scholarship.id)}
            className="remove-button"
          >
            Remove
          </button>
          {/* Remove Confirmation Modal */}
          {removeConfirmation === scholarship.id && (
            <div className="remove-confirmation-modal">
              <p>Are you sure you want to remove this scholarship?</p>
              <div>
                <button onClick={() => handleRemoveScholarship(scholarship.id)} className="confirm-button">
                  Confirm
                </button>
                <button onClick={cancelRemove} className="cancel-button">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ScholarshipList;
