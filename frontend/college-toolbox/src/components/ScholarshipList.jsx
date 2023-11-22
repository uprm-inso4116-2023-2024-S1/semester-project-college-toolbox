// External Library Imports
import React, { useState, useEffect, useRef } from 'react';
import { format, parse } from 'date-fns';
import { isSameDay } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Internal Component Imports
import FilterButtons from './FilterButtons';
import ScholarshipCard from './ScholarshipCard';
import ScholarshipForm from './ScholarshipForm';
import StatusFilter from './StatusFilter';
import YearFilter from './YearFilter';

// CSS Import
import './ScholarshipList.css';

// Constants
const STATUS_FILTER_OPTIONS = ['All', 'Accepted', 'Denied', 'Waiting'];

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
	// State for Scholarships
	const [allScholarships, setAllScholarships] = useState([
		...defaultScholarships,
	]);

	// State for Filters
	const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
	const [selectedYearFilter, setSelectedYearFilter] = useState('All');
	const [isAddingScholarship, setIsAddingScholarship] = useState(false);
	const [removeConfirmation, setRemoveConfirmation] = useState(null);

	const handleUpdateScholarship = (newScholarship) => {
		// Update the scholarship state when a new scholarship is added
		setAllScholarships((prevScholarships) => [
			...prevScholarships,
			{
				...newScholarship,
				id: prevScholarships.length + 1,
			},
		]);
	};

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [newScholarship, setNewScholarship] = useState({
		name: '',
		status: 'Waiting',
		resume: '',
		deadline: '',
	});

	// Function to extract unique years from the scholarships
	const getUniqueYears = (scholarships) => {
		const years = new Set();

		scholarships.forEach((scholarship) => {
			const deadlineDate = new Date(scholarship.deadline);

			if (!isNaN(deadlineDate.getTime())) {
				const year = format(deadlineDate, 'yyyy');
				years.add(year);
			}
		});

		return Array.from(years);
	};

	const uniqueYears = getUniqueYears(allScholarships);
	const [scholarshipCounters, setScholarshipCounters] = useState({
		total: 0,
		accepted: 0,
		denied: 0,
		waiting: 0,
	});

	//Filters
	const [statusFilter, setStatusFilter] = useState(
		new StatusFilter(selectedStatusFilter),
	);
	const [yearFilter, setYearFilter] = useState(
		new YearFilter(selectedYearFilter, uniqueYears),
	);

	const [searchQuery, setSearchQuery] = useState('');

	const applyFilters = (scholarships) => {
		return scholarships
			.filter(statusFilter.applyFilter.bind(statusFilter))
			.filter(yearFilter.applyFilter.bind(yearFilter))
			.filter((scholarship) =>
				scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()),
			);
	};

	useEffect(() => {
		setStatusFilter(new StatusFilter(selectedStatusFilter));
		setYearFilter(new YearFilter(selectedYearFilter, uniqueYears));

		const updatedFilteredScholarships = applyFilters(allScholarships);
		setFilteredScholarships(updatedFilteredScholarships);
	}, [allScholarships, selectedStatusFilter, selectedYearFilter, searchQuery]);

	// Counter Update Logic
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

	// UI Interaction Functions
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
		// Check if any of the values in newScholarship is empty
		const hasEmptyValues = Object.values(newScholarship).some(
			(value) => value === '' || value === null || value === undefined,
		);

		// If any empty values are found, don't add the scholarship
		if (hasEmptyValues) {
			console.log('Some fields are empty. Cannot add scholarship.');
			return;
		}

		console.log('Submitting scholarship form:', newScholarship);
		const updatedScholarships = [
			...allScholarships,
			{
				...newScholarship,
				id: allScholarships.length + 1,
			},
		];

		handleUpdateScholarship(newScholarship);
		setAllScholarships(updatedScholarships);

		updateCounters(updatedScholarships);

		// Close the form after a successful addition
		setIsAddingScholarship(false);
	};

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
		setSelectedStatusFilter(STATUS_FILTER_OPTIONS[0]);
		handleUpdateScholarshipStatusForFilter(STATUS_FILTER_OPTIONS[0]);
	};

	const handleFilterAccepted = () => {
		setSelectedStatusFilter(STATUS_FILTER_OPTIONS[1]);
		handleUpdateScholarshipStatusForFilter(STATUS_FILTER_OPTIONS[1]);
	};

	const handleFilterDenied = () => {
		setSelectedStatusFilter(STATUS_FILTER_OPTIONS[2]);
		handleUpdateScholarshipStatusForFilter(STATUS_FILTER_OPTIONS[2]);
	};

	const handleFilterWaiting = () => {
		setSelectedStatusFilter(STATUS_FILTER_OPTIONS[3]);
		handleUpdateScholarshipStatusForFilter(STATUS_FILTER_OPTIONS[3]);
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
				<FilterButtons
					handleFilterAll={handleFilterAll}
					handleFilterAccepted={handleFilterAccepted}
					handleFilterDenied={handleFilterDenied}
					handleFilterWaiting={handleFilterWaiting}
					selectedStatusFilter={selectedStatusFilter}
				/>
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
					<ScholarshipForm
						addScholarship={handleAddScholarship}
						updateScholarshipsState={handleUpdateScholarship}
						allScholarships={allScholarships}
						onCancel={handleCancelAddition}
					/>
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
