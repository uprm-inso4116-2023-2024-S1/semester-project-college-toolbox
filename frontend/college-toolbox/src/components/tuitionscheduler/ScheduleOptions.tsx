import React, { useState, useEffect } from 'react';
import { API_URL } from '../../app/constants';
import type {
	CourseFilters,
	FilteredCourse,
	ScheduleGenerationOptions,
} from '../../types/entities';
import { Modal } from 'flowbite-react';
import ToggleSwitch from '../ToggleSwitch';

export interface ScheduleOptions {
	courses: FilteredCourse[];
	setCourses: React.Dispatch<React.SetStateAction<FilteredCourse[]>>;
	options: ScheduleGenerationOptions;
	setOptions: React.Dispatch<React.SetStateAction<ScheduleGenerationOptions>>;
}

const ScheduleOptions: React.FC<ScheduleOptions> = ({
	courses,
	setCourses,
	options,
	setOptions,
}) => {
	// State for course list and input values
	const [courseID, setCourseID] = useState('');
	const [section, setSection] = useState('');

	// State for modal
	const [openModal, setOpenModal] = useState<string | undefined>();
	const [courseFilters, setCourseFilters] = useState<CourseFilters | undefined>(
		undefined,
	);
	const [creditBasedGeneration, setCreditBasedGeneration] =
		useState<boolean>(false);
	const [index, setIndex] = useState<number>(0);
	const daysOfWeek = ['L', 'M', 'W', 'J', 'V', 'S', 'D'];

	const modalProps = {
		openModal,
		setOpenModal,
		courseFilters,
		setCourseFilters,
		index,
		setIndex,
	};

	const currentYear = new Date().getFullYear();

	const handleDayClick = (day: string) => {
		let days = modalProps.courseFilters?.days ?? '';
		if (days.includes(day)) {
			days = days.replace(day, '');
		} else {
			days += day;
		}
		setCourseFilters({ ...modalProps.courseFilters, days });
	};

	const handleFiltersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		modalProps.setCourseFilters((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setOptions((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setOptions((prevState) => ({
			...prevState,
			[name]: value,
		}));
		setCourses([]);
	};

	const handleToggle = () => {
		setCreditBasedGeneration(!creditBasedGeneration);
		if (!creditBasedGeneration) {
			// Remove the min and max credit fields
			setOptions(({ minCredits, maxCredits, ...rest }) => rest);
		}
	};

	const saveCourseInfo = () => {
		if (!modalProps.courseFilters) {
			setOpenModal(undefined);
			return;
		}
		if (
			(modalProps.courseFilters?.startTime ?? '00:00') >
			(modalProps.courseFilters?.endTime ?? '23:59')
		) {
			alert('Start time cannot be later than end time.');
			return;
		}
		const updatedCoursesInfo = [...courses];
		if (updatedCoursesInfo[modalProps.index]?.code === undefined) return;
		// Save days string that was selected in the modal
		updatedCoursesInfo[modalProps.index]!.filters = modalProps.courseFilters;
		setCourses(updatedCoursesInfo);
		setOpenModal(undefined);
	};

	const addCourse = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (courseID.trim() !== '') {
			if (!isValidCourseFormat(courseID)) {
				alert(
					'Invalid format for course ID. Please check your input and try again.',
				);
				return;
			}
			if (!isValidSectionFormat(section)) {
				alert(
					'Invalid format for course section. Please check your input and try again.',
				);
				return;
			}

			try {
				let courseString = `${courseID}`;

				if (section.trim() !== '') {
					courseString += `-${section}`;
				}

				const isValid = await validateCourse(
					courseID,
					section,
					options.term,
					options.year,
				);
				if (isValid) {
					const newCourses = [...courses];
					const prevIdx = newCourses.findIndex(
						(course) => course.code.split('-')[0] == courseID,
					);
					if (prevIdx != -1) {
						newCourses[prevIdx] = { code: courseString };
					} else {
						newCourses.push({ code: courseString });
					}
					setCourses(newCourses);
					// Reset input fields
					setCourseID('');
					setSection('');
				} else {
					alert(
						`The course or section (${courseString}) does not exist. Please try again.`,
					);
				}
			} catch (error) {
				alert(
					'There was an error validating the course. Please try again later.',
				);
			}
		}
	};

	const deleteCourse = (indexToDelete: number) => {
		// Filter out the course with the specified index
		const updatedCourses = courses.filter(
			(_, index) => index !== indexToDelete,
		);
		setCourses(updatedCourses);
	};

	async function validateCourse(
		courseID: string,
		section: string,
		term: string,
		year: string,
	): Promise<boolean> {
		const requestBody = {
			course_id: courseID,
			section: section,
			term,
			year,
		};

		const response = await fetch(`${API_URL}/validate_course_id/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		});

		if (!response.ok) {
			throw new Error(`Validation request failed: ${response.statusText}`);
		}

		const data: { is_valid: boolean } = await response.json();
		return data.is_valid;
	}

	function isValidCourseFormat(courseID: string): boolean {
		const courseIDRegex = /^[A-Z]{4}\d{4}$/;

		return courseIDRegex.test(courseID);
	}

	function isValidSectionFormat(section: string): boolean {
		const sectionRegex = /^(\d{3}[A-Z]?)?$/;

		return sectionRegex.test(section);
	}

	return (
		<div className="relative">
			<div className="bg-gray-200 dark:bg-gray-800 rounded-lg col-span-2 p-4">
				<h2 className="text-xl font-extrabold text-gray-900 dark:text-white p-1 mb-1">
					Course Selection
				</h2>

				<form onSubmit={addCourse}>
					<div className="grid grid-cols-10 gap-1">
						<div className="col-span-4">
							<label
								htmlFor="course_name"
								className="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-white p1 overflow-ellipsis"
							>
								Course ID <span className="text-red-600">*</span>
							</label>
						</div>
						<div className="col-span-4">
							<label
								htmlFor="course_section"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white overflow-ellipsis"
							>
								Course Section
							</label>
						</div>
						<div className="col-span-2" />

						<div className="col-span-4">
							<input
								type="text"
								id="course_name"
								value={courseID}
								onChange={(e) => setCourseID(e.target.value.toUpperCase())}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="i.e. CIIC3015"
								required
							/>
						</div>
						<div className="col-span-4">
							<input
								type="text"
								id="course_section"
								value={section}
								onChange={(e) => setSection(e.target.value.toUpperCase())}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="i.e. 030, 116L"
							/>
						</div>
						<div className="col-span-2">
							<button
								type="submit"
								className="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm w-full px-2.5 py-2 text-center text-white"
							>
								Add
							</button>
						</div>
					</div>
				</form>
				{courses.length > 0 && (
					<div className="space-y-2 overflow-y-auto max-h-52 mt-1">
						{courses.map((_course: FilteredCourse, idx) => (
							<div
								key={idx}
								className="bg-gray-50 dark:bg-gray-800 p-2 rounded border dark:border-gray-700 flex justify-between items-center"
							>
								<span className="text-gray-900 dark:text-white">
									{_course.code}
								</span>
								{
									// Leave filter icon invisible until course filters are implemented
									<button
										className="  rounded-sm w-6 h-6 focus:outline-none hover:bg-gray-300 dark:hover:bg-gray-500 dark:text-gray-300"
										onClick={() => {
											modalProps.setIndex(idx);
											modalProps.setCourseFilters(_course.filters);
											modalProps.setOpenModal('dismissible');
										}}
									>
										<svg
											className="w-6 h-6 text-gray-800 dark:text-white"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 20 20"
										>
											<path
												stroke="currentColor"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M7.75 4H19M7.75 4a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 4h2.25m13.5 6H19m-2.25 0a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 10h11.25m-4.5 6H19M7.75 16a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 16h2.25"
											/>
										</svg>
									</button>
								}
								<button
									onClick={() => deleteCourse(idx)}
									className="bg-red-500 text-white rounded-lg w-6 h-6 focus:outline-none hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 dark:text-gray-300"
								>
									X
								</button>
							</div>
						))}
					</div>
				)}
			</div>

			<div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg col-span-3">
				<h2 className="text-xl font-extrabold text-gray-900 dark:text-white p-1 mb-5">
					Schedule Generation Options
				</h2>
				<div className="grid grid-cols-1 gap-1">
					<div className="grid grid-cols-8 gap-1">
						<div className="col-span-4">
							<label
								htmlFor="term"
								className="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-white p-1 overflow-ellipsis"
							>
								Term <span className="text-red-600">*</span>
							</label>
							<select
								id="term"
								name="term"
								value={options.term}
								onChange={handleSelectChange}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								required
							>
								<option value="1erSem">Fall</option>
								<option value="2doSem">Spring</option>
								<option value="1erVer">First Summer</option>
								<option value="2doVer">Second Summer</option>
							</select>
						</div>
						<div className="col-span-4">
							<label
								htmlFor="year"
								className="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-white p-1 overflow-ellipsis"
							>
								Year <span className="text-red-600">*</span>
							</label>
							<select
								id="year"
								name="year"
								value={options.year}
								onChange={handleSelectChange}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								required
							>
								<option value={`${currentYear - 1}`}>
									{currentYear - 1}-{currentYear}
								</option>
								<option value={`${currentYear}`}>
									{currentYear}-{currentYear + 1}
								</option>
							</select>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4 justify-center items-center">
						<label
							htmlFor="max-schedules-range"
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>
							Maximum Schedules Generated: {options.maxSchedules ?? 5}
						</label>
						<input
							id="max-schedules-range"
							name="maxSchedules"
							type="range"
							min="1"
							max="25"
							value={options.maxSchedules ?? 5}
							step="1"
							className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
							onChange={handleOptionsChange}
						/>
					</div>
					<span className="text-sm font-medium text-gray-900 dark:text-gray-300">
						Toggle Credit Constrained Generation
					</span>
					<ToggleSwitch
						id="credit-gen-toggle"
						checked={creditBasedGeneration}
						onChange={handleToggle}
						className="border border-gray-400 rounded-full"
					/>
					{creditBasedGeneration && (
						<div className="grid grid-cols-2 gap-4 justify-center items-center">
							<label
								htmlFor="min-creds-range"
								className="block text-sm font-medium text-gray-900 dark:text-white"
							>
								Minimum Credits: {options.minCredits}
							</label>
							<input
								id="min-creds-range"
								name="minCredits"
								type="range"
								min="0"
								max="21"
								value={options.minCredits ?? 12}
								step="1"
								className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
								onChange={handleOptionsChange}
							/>
							<label
								htmlFor="max-creds-range"
								className="block text-sm font-medium text-gray-900 dark:text-white"
							>
								Maximum Credits: {options.maxCredits}
							</label>
							<input
								id="max-creds-range"
								name="maxCredits"
								type="range"
								min="0"
								max="21"
								value={options.maxCredits ?? 18}
								step="1"
								className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
								onChange={handleOptionsChange}
							/>
						</div>
					)}
				</div>
			</div>

			<Modal
				dismissible
				show={modalProps.openModal === 'dismissible'}
				onClose={() => modalProps.setOpenModal(undefined)}
			>
				<Modal.Header>
					Course Filters: {courses[modalProps.index]?.code}
				</Modal.Header>
				<Modal.Body>
					<div className="bg-white dark:bg-gray-700 p-8 rounded dark:text-white">
						<div className="grid grid-cols-2 gap-4">
							<div>
								Earliest Start Time
								<input
									type="time"
									placeholder="Earliest Start Time"
									name="startTime"
									value={modalProps.courseFilters?.startTime}
									onChange={handleFiltersChange}
									className="border border-gray-300 p-2 mb-4 w-full rounded-md dark:text-black dark:bg-gray-200"
								/>
							</div>
							<div>
								Latest End Time
								<input
									type="time"
									placeholder="Latest End Time"
									name="endTime"
									value={modalProps.courseFilters?.endTime}
									onChange={handleFiltersChange}
									className="border border-gray-300 p-2 mb-4 w-full dark:text-black dark:bg-gray-200"
								/>
							</div>
						</div>
						Days
						<div className="flex justify-center space-x-4 mb-4">
							{daysOfWeek.map((day, index) => (
								<div
									key={index}
									className={`w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-800 rounded-full cursor-pointer ${
										modalProps.courseFilters?.days?.includes(day)
											? 'bg-blue-500 text-white'
											: 'bg-white dark:bg-gray-700'
									}`}
									onClick={() => handleDayClick(day)}
								>
									{day}
								</div>
							))}
						</div>
						Professor
						<input
							type="text"
							placeholder="Professor"
							name="professor"
							value={modalProps.courseFilters?.professor}
							onChange={handleFiltersChange}
							className="border border-gray-300 p-2 mb-4 w-full dark:bg-gray-200 dark:text-black"
						/>
						<button
							onClick={saveCourseInfo}
							className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded "
						>
							Save
						</button>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default ScheduleOptions;
