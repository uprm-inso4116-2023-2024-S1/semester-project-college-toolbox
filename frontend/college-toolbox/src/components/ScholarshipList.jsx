import React, { useState, useEffect } from 'react';
import ScholarshipCard from './ScholarshipCard';
import { format, parse } from 'date-fns';

import './ScholarshipList.css'; // Import your CSS file

const defaultScholarships = [
	{
		id: 1,
		name: 'Default Scholarship 1',
		status: 'Accepted',
		resume: 'John_Doe_Resume.pdf',
		deadline: '2023-12-31',
	},
	{
		id: 2,
		name: 'Default Scholarship 2',
		status: 'Denied',
		resume: 'Jane_Smith_Resume.pdf',
		deadline: '2023-11-30',
	},
];

const ScholarshipList = () => {
	const [newScholarship, setNewScholarship] = useState({
		name: '',
		status: 'Waiting',
		resume: '',
		deadline: '',
	});
	const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
	const [selectedYearFilter, setSelectedYearFilter] = useState('All');

	const [allScholarships, setAllScholarships] = useState(defaultScholarships);
	const [isAddingScholarship, setIsAddingScholarship] = useState(false);
	const [removeConfirmation, setRemoveConfirmation] = useState(null);

	const calculateCounters = () => {
		const total = allScholarships.length;
		const accepted = allScholarships.filter(
			(scholarship) => scholarship.status === 'Accepted',
		).length;
		const denied = allScholarships.filter(
			(scholarship) => scholarship.status === 'Denied',
		).length;
		const waiting = allScholarships.filter(
			(scholarship) => scholarship.status === 'Waiting',
		).length;
		return { total, accepted, denied, waiting };
	};

	const [scholarshipCounters, setScholarshipCounters] = useState(
		calculateCounters(),
	);

	const updateCounters = (newScholarships) => {
		const total = newScholarships.length;
		const accepted = newScholarships.filter(
			(scholarship) => scholarship.status === 'Accepted',
		).length;
		const denied = newScholarships.filter(
			(scholarship) => scholarship.status === 'Denied',
		).length;
		const waiting = newScholarships.filter(
			(scholarship) => scholarship.status === 'Waiting',
		).length;
		setScholarshipCounters({ total, accepted, denied, waiting });
	};

	useEffect(() => {
		const accepted = allScholarships.filter(
			(scholarship) => scholarship.status === 'Accepted',
		).length;
		const denied = allScholarships.filter(
			(scholarship) => scholarship.status === 'Denied',
		).length;
		const waiting = allScholarships.filter(
			(scholarship) => scholarship.status === 'Waiting',
		).length;

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
		const scholarshipToAdd = {
			id: allScholarships.length + 1,
			...newScholarship,
		};

		const updatedScholarships = [...allScholarships, scholarshipToAdd];
		setAllScholarships(updatedScholarships);

		setNewScholarship({
			name: '',
			status: 'Waiting',
			resume: '',
			deadline: '',
		});

		const accepted = updatedScholarships.filter(
			(scholarship) => scholarship.status === 'Accepted',
		).length;
		const denied = updatedScholarships.filter(
			(scholarship) => scholarship.status === 'Denied',
		).length;
		const waiting = updatedScholarships.filter(
			(scholarship) => scholarship.status === 'Waiting',
		).length;
		setScholarshipCounters({
			total: updatedScholarships.length,
			accepted,
			denied,
			waiting,
		});

		setIsAddingScholarship(false);
		updateCounters(updatedScholarships);
	};

	const showRemoveConfirmation = (id) => {
		setRemoveConfirmation(id);
	};

	const handleRemoveScholarship = (id) => {
		const updatedScholarships = allScholarships.filter(
			(scholarship) => scholarship.id !== id,
		);

		setAllScholarships(updatedScholarships);

		setRemoveConfirmation(null);

		updateCounters(updatedScholarships);
	};

	const cancelRemove = () => {
		setRemoveConfirmation(null);
	};

	const handleCancelAddition = () => {
		setNewScholarship({
			name: '',
			status: 'Waiting',
			resume: '',
			deadline: '',
		});

		setIsAddingScholarship(false);
	};

	const getUniqueYears = (scholarships) => {
		const years = new Set();
		scholarships.forEach((scholarship) => {
			const year = format(
				parse(scholarship.deadline, 'yyyy-MM-dd', new Date()),
				'yyyy',
			);
			years.add(year);
		});
		return Array.from(years);
	};

	const uniqueYears = getUniqueYears(allScholarships);

	const filteredScholarships = allScholarships
		.filter(
			(scholarship) =>
				selectedStatusFilter === 'All' ||
				scholarship.status === selectedStatusFilter,
		)
		.filter((scholarship) => {
			if (selectedYearFilter === 'All') {
				return true;
			} else if (selectedYearFilter === 'Recent') {
				const currentMonthYear = format(new Date(), 'yyyy-MM');
				return scholarship.deadline.startsWith(currentMonthYear);
			} else {
				return scholarship.deadline.startsWith(selectedYearFilter);
			}
		});

	return (
		<div style={{ paddingLeft: '20px' }}>
			<div className="filter-section">
				<label>Filter by Status:</label>
				<select
					value={selectedStatusFilter}
					onChange={(e) => setSelectedStatusFilter(e.target.value)}
					className="input-field"
				>
					<option value="All">All</option>
					<option value="Accepted">Accepted</option>
					<option value="Denied">Denied</option>
					<option value="Waiting">Waiting</option>
				</select>
			</div>

			<div className="filter-section">
				<label>Filter by Year:</label>
				<select
					value={selectedYearFilter}
					onChange={(e) => setSelectedYearFilter(e.target.value)}
					className="input-field"
				>
					<option value="All">All</option>
					{uniqueYears.map((year) => (
						<option key={year} value={year}>
							{year}
						</option>
					))}
				</select>
			</div>

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

			{filteredScholarships.map((scholarship) => (
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
					{removeConfirmation === scholarship.id && (
						<div className="remove-confirmation-modal">
							<p>Are you sure you want to remove this scholarship?</p>
							<div>
								<button
									onClick={() => handleRemoveScholarship(scholarship.id)}
									className="confirm-button"
								>
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
