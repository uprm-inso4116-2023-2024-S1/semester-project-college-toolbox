import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ScholarshipCard from './ScholarshipCard';
import { format, parse } from 'date-fns';
import { isSameDay } from 'date-fns';

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
	{
		id: 3,
		name: 'Default Scholarship 3',
		status: 'Waiting',
		resume: 'Jane_Smith_Resume.pdf',
		deadline: '2023-11-30',
	},
	{
		id: 4,
		name: 'Default Scholarship 4',
		status: 'Denied',
		resume: 'Jane_Smith_Resume.pdf',
		deadline: '2023-11-30',
	},
	{
		id: 5,
		name: 'Default Scholarship 5',
		status: 'Accepted',
		resume: 'Jane_Smith_Resume.pdf',
		deadline: '2023-11-30',
	},
];

const ScholarshipList = () => {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [newScholarship, setNewScholarship] = useState({
		name: '',
		status: 'Waiting',
		resume: '',
		deadline: '',
	});

	// Define the handleInputChange function
	const handleInputChange = (e) => {
		const { name, value, type, files } = e.target;

		// For file inputs, handle the file separately
		if (type === 'file') {
			const file = files[0];
			setNewScholarship((prevScholarship) => ({
				...prevScholarship,
				[name]: file,
			}));
		} else {
			// For regular inputs, update the state directly
			setNewScholarship((prevScholarship) => ({
				...prevScholarship,
				[name]: value,
			}));
		}
	};

	const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
	const [selectedYearFilter, setSelectedYearFilter] = useState('All');

	const [allScholarships, setAllScholarships] = useState(defaultScholarships);
	const [isAddingScholarship, setIsAddingScholarship] = useState(false);
	const [removeConfirmation, setRemoveConfirmation] = useState(null);

	const [scholarshipCounters, setScholarshipCounters] = useState({
		total: 0,
		accepted: 0,
		denied: 0,
		waiting: 0,
	});

	const calculateCounters = (scholarships) => {
		const total = scholarships.length;
		const accepted = scholarships.filter(
			(scholarship) => scholarship.status === 'Accepted',
		).length;
		const denied = scholarships.filter(
			(scholarship) => scholarship.status === 'Denied',
		).length;
		const waiting = scholarships.filter(
			(scholarship) => scholarship.status === 'Waiting',
		).length;
		return { total, accepted, denied, waiting };
	};

	const updateCounters = (newScholarships) => {
		const counters = calculateCounters(newScholarships);
		setScholarshipCounters(counters);
	};

	useEffect(() => {
		updateCounters(allScholarships);
	}, [allScholarships]);

	const showRemoveConfirmation = (id) => {
		setRemoveConfirmation((prevId) => (prevId === id ? null : id));
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
	const handleAddScholarship = () => {
		const updatedScholarships = [
			...allScholarships,
			{
				...newScholarship,
				id: allScholarships.length + 1,
			},
		];

		setAllScholarships(updatedScholarships);
		setIsAddingScholarship(false);
		updateCounters(updatedScholarships);
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

	const [searchQuery, setSearchQuery] = useState('');
	const [filteredScholarships, setFilteredScholarships] = useState([]);

	const handleUpdateStatus = (id, newStatus) => {
		const updatedScholarships = allScholarships.map((scholarship) => {
			if (scholarship.id === id) {
				return { ...scholarship, status: newStatus };
			} else {
				return scholarship;
			}
		});

		setAllScholarships(updatedScholarships);
	};
	// ...

	// Updated onClick handlers for filter buttons
	const handleFilterAll = () => {
		setSelectedStatusFilter('All');
		handleUpdateScholarshipStatusForFilter('All');
	};

	const handleFilterAccepted = () => {
		setSelectedStatusFilter('Accepted');
		handleUpdateScholarshipStatusForFilter('Accepted');
	};

	const handleFilterDenied = () => {
		setSelectedStatusFilter('Denied');
		handleUpdateScholarshipStatusForFilter('Denied');
	};

	const handleFilterWaiting = () => {
		setSelectedStatusFilter('Waiting');
		handleUpdateScholarshipStatusForFilter('Waiting');
	};

	// ...
	const handleUpdateScholarshipStatusForFilter = (status) => {
		const newStatus = status === 'All' ? 'All' : status;
		const updatedScholarships = allScholarships.map((scholarship) => {
			if (newStatus === 'All' || scholarship.status === newStatus) {
				return { ...scholarship, hidden: false };
			} else {
				return { ...scholarship, hidden: true };
			}
		});

		setAllScholarships(updatedScholarships);
		updateCounters(updatedScholarships);

		// Update the filtered scholarships based on the new status
		const updatedFilteredScholarships = updatedScholarships.filter(
			(scholarship) => !scholarship.hidden,
		);
		setFilteredScholarships(updatedFilteredScholarships);

		setSelectedStatusFilter(newStatus);
	};

	// ...
	// ...

	// Function to extract unique deadlines from the scholarships
	const getUniqueDeadlines = (scholarships) => {
		return scholarships.map((scholarship) => new Date(scholarship.deadline));
	};

	const uniqueDeadlines = getUniqueDeadlines(allScholarships);

	// Function to check if a date is in the list of scholarship deadlines
	const isDeadlineDate = (date) => {
		return uniqueDeadlines.some((deadline) => isSameDay(date, deadline));
	};

	// Move this part inside the component
	const prevSelectedYearFilter = useRef(selectedYearFilter);

	useEffect(() => {
		// Step 3: Implement a filtering mechanism based on the search query
		const updatedFilteredScholarships = allScholarships
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
			})
			.filter((scholarship) =>
				scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()),
			);

		setFilteredScholarships(updatedFilteredScholarships);
	}, [allScholarships, selectedStatusFilter, selectedYearFilter, searchQuery]);

	return (
		<div>
			<div className="calendar-section">
				<Calendar
					onChange={setSelectedDate}
					value={selectedDate}
					tileContent={({ date }) => {
						if (isDeadlineDate(date)) {
							return <p style={{ color: 'red' }}>DL</p>;
						}
					}}
					calendarType="gregory"
				/>
				<p>Selected Date: {selectedDate.toDateString()}</p>
			</div>
			<p>DL represents Scholarship Deadline in calendar.</p>
			<div className="search-bar">
				<input
					type="text"
					placeholder="Search Scholarships"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="input-field"
				/>
			</div>
			<div className="filter-section">
				<div className="filter-status">
					<p>Filtering by Status: {selectedStatusFilter}</p>
				</div>
				<div className="filter-buttons">
					<button
						className={`filter-button ${
							selectedStatusFilter === 'All' ? 'active' : ''
						}`}
						onClick={handleFilterAll}
					>
						All
					</button>
					<button
						className={`filter-button ${
							selectedStatusFilter === 'Accepted' ? 'active' : ''
						}`}
						onClick={handleFilterAccepted}
					>
						Accepted
					</button>
					<button
						className={`filter-button ${
							selectedStatusFilter === 'Denied' ? 'active' : ''
						}`}
						onClick={handleFilterDenied}
					>
						Denied
					</button>
					<button
						className={`filter-button ${
							selectedStatusFilter === 'Waiting' ? 'active' : ''
						}`}
						onClick={handleFilterWaiting}
					>
						Waiting
					</button>
				</div>
			</div>
			<div className="filter-section">
				<label>Filter by Year:</label>
				<select
					value={selectedYearFilter}
					onChange={(e) => setSelectedYearFilter(e.target.value)}
					className="input-field"
				>
					<option value="All">All</option>
					<option value="Recent">Recent</option> {/* Add this line */}
					{uniqueYears.map((year) => (
						<option key={year} value={year}>
							{year}
						</option>
					))}
				</select>
			</div>

			{/* Move the filtering status outside of the dropdown */}

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
			{/* Use the class name directly */}
			<div className="scholarship-list-horizontal">
				{filteredScholarships.map((scholarship) => (
					<div key={scholarship.id} className="scholarship-card-horizontal">
						<ScholarshipCard
							scholarship_name={scholarship.name}
							applicationStatus={scholarship.status}
							applicantResume={scholarship.resume}
							applicationDeadline={scholarship.deadline}
							onUpdateStatus={(newStatus) =>
								handleUpdateStatus(scholarship.id, newStatus)
							} // Pass callback
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
		</div>
	);
};
export default ScholarshipList;
