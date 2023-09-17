import React, { useState, useEffect } from 'react';

const ScholarshipCard = ({
  scholarship_name,
  applicantResume,
  applicationStatus,
  applicationDeadline,
}) => {
  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '20px',
    padding: '2px 10px ',
    paddingBottom: '10px',
    margin: '10px 0', // Add margin at the top and bottom
    backgroundColor: '#35495e',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle = {
    fontSize: '1.5rem', // Increase font size
    marginBottom: '10px', // Increase margin bottom
    paddingLeft: '10px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#3498db', // Dark light blue color

  };
  

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start', // Align elements to the left
  };

  const statusColors = {
    Accepted: 'green',
    Denied: 'red',
    Waiting: '#FF5733', // Darker yellow color
  };

  const [editedStatus, setEditedStatus] = useState(applicationStatus);
  const [tempStatus, setTempStatus] = useState(applicationStatus); // Temporary status for edits

  useEffect(() => {
    setTempStatus(editedStatus);
  }, [editedStatus]);

  const bubbleStyle = {
    display: 'inline-block',
    backgroundColor: statusColors[tempStatus] || 'lightyellow', // Updated this line to use tempStatus
    color: '#fff',
    padding: '5px 8px',
    borderRadius: '15px',
    margin: '5px', // Add margin to create space between bubbles
    whiteSpace: 'nowrap', // Prevent text wrapping to the next line
    fontSize: '0.9rem',
  };

  const editButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    marginRight: '5px',
    marginTop: '5px',
    fontSize: '0.9rem',
  };

  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [resumeFileName, setResumeFileName] = useState(applicantResume);
  const [isDeletingResume, setIsDeletingResume] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(
    applicantResume === ''
  );

  const handleEditStatus = () => {
    setIsEditingStatus(true);
  };

  const handleCancelEdit = () => {
    // Revert editedStatus to the original status when canceling the edit
    setEditedStatus(tempStatus);
    setIsEditingStatus(false);
  };

  const handleSaveStatus = () => {
    // Perform any necessary actions here, e.g., update the status in the database
    setIsEditingStatus(false);
  };
  const handleResumeUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setResumeFileName(uploadedFile.name);
      const formData = new FormData();
      formData.append('uploadedFile.name', uploadedFile);
      console.log('FormData:', formData);
      // Make a POST request to FastAPI
      fetch('/ScholarshipApplication/upload-resume', {
        method: 'POST',
        body:  formData
      })
        .then(response=> {
          if(response.ok) {
            //File was uploaded
            //Handle success
            console.log("Hoopla! File uploaded.");
          } else {
            // Failure
            console.error("Not hoopla, file upload FAILURE.")
          }
        })
        .catch(error=> {
          // Handle network errors
          console.error('Error:', error)
        });
      
      setIsUploadingResume(false);
    }
  };

  const handleResumeDelete = () => {
    if (!isDeletingResume) {
      setIsDeletingResume(true);
    } else {
      // Perform delete action here or reset state if canceled
      setResumeFileName('');
      setIsDeletingResume(false);
    }
  };

  return (
    <div className="my-scholarship-card">
      <div className="card" style={cardStyle}>
        <div className="card-content">
          <p className="card-title" style={titleStyle}>
            <strong>{scholarship_name}</strong>
          </p>
          
          <div style={containerStyle}>
            {!isEditingStatus ? (
              <div>
                
                <div style={bubbleStyle}>
                  <strong>Status:</strong> {editedStatus}
                </div>
                <button
                  style={editButtonStyle}
                  onClick={handleEditStatus}
                  className={isEditingStatus ? 'hidden' : ''}
                >
                  Edit
                </button>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'lightgrey',
                      color: '#333',
                      padding: '3px 8px',
                      borderRadius: '15px',
                      margin: '5px', // Add margin to create space between bubbles
                      whiteSpace: 'nowrap', // Prevent text wrapping to the next line
                      cursor: resumeFileName ? 'pointer' : 'default',
                      fontSize: '0.9rem',
                    }}
                    onClick={() => {
                      if (resumeFileName) {
                        // Simulate a download when the resume name is clicked
                        // Replace this with actual download logic
                        window.location.href = `/download-resume?resume_filename=${resumeFileName}`;
                        alert('Downloading resume: ' + resumeFileName);

                      }
                    }}
                  >
                    Resume: {resumeFileName || 'No file uploaded'}
                  </div>
                  {(!resumeFileName || isUploadingResume) && !isEditingStatus && (
                    <div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeUpload}
                      />
                    </div>
                  )}
                  {resumeFileName && !isUploadingResume && !isEditingStatus && (
                    <button onClick={handleResumeDelete}>Delete</button>
                  )}
                </div>
                {applicationDeadline && (
                  <div
                    style={{
                      backgroundColor: 'lightgrey',
                      color: '#333',
                      padding: '3px 8px',
                      borderRadius: '15px',
                      margin: '5px', // Add margin to create space between bubbles
                      whiteSpace: 'nowrap', // Prevent text wrapping to the next line
                      width: 'fit-content',
                      fontSize: '0.9rem',
                    }}
                  >
                    Deadline: {applicationDeadline}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                >
                  <option value="Accepted">Accepted</option>
                  <option value="Denied">Denied</option>
                  <option value="Waiting">Waiting</option>
                </select>
                <button onClick={handleSaveStatus}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipCard;
