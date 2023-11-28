import React, { useState, useEffect } from 'react';
import ScholarshipApplicationFactory from './ScholarshipFactory';
import { $authToken } from '../lib/profile';
import { API_URL } from '../app/constants';
import './ScholarshipCard.css'; // Import the CSS file directly
// const applicationFactory = new ScholarshipApplicationFactory();

const ScholarshipCard = ({
	scholarship_name,
	applicantResume,
	applicationStatus,
	applicationDeadline,
	onUpdateStatus,
}) => {
	const [editedStatus, setEditedStatus] = useState(applicationStatus);
	const [tempStatus, setTempStatus] = useState(applicationStatus);
	const [isEditingStatus, setIsEditingStatus] = useState(false);

	useEffect(() => {
		setTempStatus(editedStatus);
	}, [editedStatus]);

	const getStatusColor = (status) => {
		const statusColors = {
			Accepted: 'green',
			Denied: 'red',
			Waiting: 'waiting',
		};
		return statusColors[status] || 'lightyellow';
	};

	const [resumeFileName, setResumeFileName] = useState(applicantResume);
	const [isDeletingResume, setIsDeletingResume] = useState(false);
	const [isUploadingResume, setIsUploadingResume] = useState(
		applicantResume === '',
	);

	const handleEditStatus = () => {
		setIsEditingStatus(true);
	};

	const handleCancelEdit = () => {
		setEditedStatus(tempStatus);
		setIsEditingStatus(false);
	};

	const handleSaveStatus = () => {
		setIsEditingStatus(false);
		onUpdateStatus(editedStatus);
	};

	const uploadResume = (uploadedFile) => {
		const fileName = uploadedFile.name;
		setResumeFileName(fileName);
		const formData = new FormData();
		formData.append('filename', fileName);
		formData.append('data', uploadedFile);
		formData.append('filetype', 'pdf');

		fetch(`${API_URL}/createResume`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${$authToken.get()}`,
			},
			body: formData,
		})
			.then((response) => {
				if (response.ok) {
					console.log(response);
					console.log('File uploaded successfully.');
				} else {
					console.error('File upload failed.');
				}
			})
			.catch((error) => {
				console.error('Error:', error);
			});

		setIsUploadingResume(false);
	};

	const handleResumeUpload = (e) => {
		const uploadedFile = e.target.files[0];
		if (uploadedFile) {
			uploadResume(uploadedFile);
		}
	};

	const deleteResume = () => {
		if (!isDeletingResume) {
			setIsDeletingResume(true);
		}

		const formData = new FormData();
		formData.append('uploadedFile.name', resumeFileName);

		fetch(`${API_URL}/delete-resume`, {
			method: 'POST',
			body: formData,
		})
			.then((response) => {
				if (response.ok) {
					console.log('File deleted successfully.');
				} else {
					console.error('File delete failed.');
				}
			})
			.catch((error) => {
				console.error('Error:', error);
			});

		setResumeFileName('');
		setIsDeletingResume(false);
	};

	const handleResumeDelete = () => {
		deleteResume();
	};
	return (
		<div className="card">
			<div className="cardContent">
				<p className="cardTitle">
					<strong>{scholarship_name}</strong>
				</p>

				<div className="containerStyle">
					{!isEditingStatus ? (
						<div>
							<div className={`bubble ${getStatusColor(editedStatus)}`}>
								<strong>Status:</strong> {editedStatus}
							</div>
							<button
								className={`editButton ${isEditingStatus ? 'hidden' : ''}`}
								onClick={() => setIsEditingStatus(true)}
							>
								Edit
							</button>
							<div className="fileActions">
								<div
									className="fileInfo"
									onClick={() => {
										if (resumeFileName) {
											window.location.href = `/download-resume?resume_filename=${resumeFileName.name}`;
											alert('Downloading resume: ' + resumeFileName.name);
										}
									}}
								>
									Resume:{' '}
									{resumeFileName ? resumeFileName.name : 'No file uploaded'}
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
								<div className="deadlineInfo">
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
	);
};

export default ScholarshipCard;
