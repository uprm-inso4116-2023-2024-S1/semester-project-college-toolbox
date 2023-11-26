import React, { useState } from 'react';
import FormFactory from './FormFactory';
import ScholarshipList from './ScholarshipList'; // Import the ScholarshipList component

const ScholarshipForm = ({ allScholarships, addScholarship }) => {
	const scholarshipFormConfig = [
		{
			label: 'Name',
			name: 'name',
			type: 'text',
		},
		{
			label: 'Status',
			name: 'status',
			type: 'select',
			options: [
				{ value: 'Accepted', label: 'Accepted' },
				{ value: 'Denied', label: 'Denied' },
				{ value: 'Waiting', label: 'Waiting' },
			],
		},
		{
			label: 'Resume',
			name: 'resume',
			type: 'file',
			accept: '.pdf',
		},
		{
			label: 'Deadline',
			name: 'deadline',
			type: 'date',
		},
	];

	const scholarshipFormSubmitLabel = 'Submit Scholarship';
	const scholarshipFormCancelLabel = 'Cancel';

	const [formData, setFormData] = useState({
		name: '',
		status: 'Waiting',
		resume: '',
		deadline: '',
	});

	const handleInputChange = (e) => {
		const { name, value, type, files } = e.target;

		if (type === 'file') {
			const file = files[0];
			setFormData((prevFormData) => ({
				...prevFormData,
				[name]: file,
			}));
		} else {
			setFormData((prevFormData) => ({
				...prevFormData,
				[name]: value,
			}));
		}
	};

	const handleAdd = () => {
		// Add logic to handle the submission
		addScholarship({
			...formData,
			id: allScholarships.length + 1,
		});
		setFormData({
			name: '',
			status: 'Waiting',
			resume: '',
			deadline: '',
		});
	};

	const handleCancel = () => {
		// Add logic to handle cancellation
		setFormData({
			name: '',
			status: 'Waiting',
			resume: '',
			deadline: '',
		});
	};

	return (
		<div>
			<FormFactory
				formConfig={scholarshipFormConfig}
				formData={formData}
				handleInputChange={handleInputChange}
				handleAdd={handleAdd}
				handleCancel={handleCancel}
				submitLabel={scholarshipFormSubmitLabel}
				cancelLabel={scholarshipFormCancelLabel}
			/>
			{/* Render the ScholarshipList with the updated scholarships */}
			<ScholarshipList allScholarships={allScholarships} />
		</div>
	);
};

export default ScholarshipForm;
