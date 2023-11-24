import React, { useState } from 'react';
import FormFactory from './FormFactory';

const ScholarshipForm = ({
	addScholarship,
	updateScholarshipsState,
	allScholarships,
	onCancel,
}) => {
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
			name: 'resume', // <-- Make sure this matches the key in formData
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
		console.log('Submitting scholarship form:', formData);

		// Check if any of the values in formData is empty
		const hasEmptyValues = Object.values(formData).some(
			(value) => value === '' || value === null || value === undefined,
		);

		// If any empty values are found, don't add the scholarship
		if (hasEmptyValues) {
			console.log('Some fields are empty. Cannot add scholarship.');
			return;
		}

		// Add logic to handle the submission
		addScholarship(formData);

		updateScholarshipsState(formData);
		setFormData({
			name: '',
			status: 'Waiting',
			resume: '',
			deadline: '',
		});

		// Close the form after a successful addition
		onCancel();
	};

	return (
		<div>
			<FormFactory
				formConfig={scholarshipFormConfig}
				formData={formData}
				handleInputChange={handleInputChange}
				handleAdd={handleAdd}
				handleCancel={onCancel}
				submitLabel={scholarshipFormSubmitLabel}
				cancelLabel={scholarshipFormCancelLabel}
			/>
		</div>
	);
};

export default ScholarshipForm;
