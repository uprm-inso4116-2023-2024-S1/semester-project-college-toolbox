import React, { useState } from 'react';
import type { SavedScheduleModel } from '../../types/entities';
import { Modal } from 'flowbite-react';
import WeeklyCalendar from '../tuitionscheduler/WeeklyCalendar';
import { API_URL } from '../../app/constants';

const SavedScheduleView: React.FC<{
	applications: SavedScheduleModel[];
	onDeleteSchedule: (deletedScheduleId: number) => void;
}> = ({ applications, onDeleteSchedule }) => {
	const [openModal, setOpenModal] = useState<string | undefined>();
	const [schedule, setSchedule] = useState<SavedScheduleModel | undefined>();
	const modalProps = { openModal, setOpenModal, schedule, setSchedule };
	const [costPerCredit, setCostPerCredit] = useState<number>(0);

	const deleteSchedule = async (schedule_id: number | undefined) => {
		if (!schedule_id) {
			console.error('Schedule ID is undefined.');
			return;
		}

		try {
			const response = await fetch(`${API_URL}/save_schedule/delete`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ schedule_id }),
			});

			const data = await response.json();

			if (response.ok) {
				console.log('Schedule deleted successfully:', data);
				onDeleteSchedule(schedule_id);
				setOpenModal(undefined);
			} else {
				console.error('Failed to delete the schedule:', data);
			}
		} catch (error) {
			console.error('An error occurred while deleting the schedule:', error);
		}
	};

	function termEnumToString(term: string): string {
		const conversions = {
			'1erSem': 'Fall',
			'2doSem': 'Spring',
			'1erVer': 'First Summer',
			'2doVer': 'Second Summer',
		};
		return (conversions as Record<string, string>)[term] ?? '';
	}


	const calculateTotalCost = (saved_schedule: SavedScheduleModel | undefined) => {
		if (!saved_schedule || Number.isNaN(costPerCredit)) {
			return '0.00';
		}
		
		const totalCredits = saved_schedule.schedule.courses.reduce((acc, course) => acc + course.credits, 0);
		return (totalCredits * costPerCredit).toFixed(2);
	};

	return (
		<div className="bg-gray-200 rounded-lg p-4 dark:bg-gray-700 dark:text-white">
			
			<div className="flex flex-wrap items-center justify-between mb-4">
				<h2 className="text-2xl font-extrabold">Saved Schedules</h2>
				<div className="flex items-center">
					{/* Input for cost per credit hour */}
					<label htmlFor="costPerCredit" className="mr-2 text-lg font-medium text-gray-900 dark:text-white">
						Cost per Credit Hour:
					</label>
					<input
						type="number"
						id="costPerCredit"
						value={costPerCredit}
						onChange={(e) => setCostPerCredit(parseFloat(e.target.value))}
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Enter cost per credit"
						style={{ maxWidth: '200px' }} // Set a max-width to prevent the input from stretching too far
					/>
				</div>
			</div>

			<div className="self-stretch border-t-2 border-gray-400 dak:border-gray-500 mb-1 my-1 w-full" />

			<div className="overflow-y-auto">
				<div className="grid grid-cols-4 gap-4 p-3">
					{applications.map((saved_schedule, index) => (
						<button
							key={index}
							className="application-block relative bg-gray-300 dark:bg-gray-600 dark:border-gray-800 border-gray-400 border-2 rounded-xl hover:scale-105 dark:hover:border-blue-400 hover:border-blue-400 transition-transform flex flex-col items-center p-4"
							onClick={() => {
								setOpenModal('dismissible');
								setSchedule(saved_schedule); // Set the schedule here
							}}
						>
							<div className="w-full bg-gray-400 dark:bg-gray-700 text-center py-2 rounded-t-xl font-bold text-lg">
								{saved_schedule.name}
							</div>

							<div className="w-full bg-green-300 dark:bg-green-500 text-center py-2 rounded-b-xl font-bold text-lg my-0 mb-2">
								{termEnumToString(saved_schedule.term)} {saved_schedule.year}{' '}
								Semester
							</div>

							<div className="self-stretch border-t-2 border-gray-400 mb-1 my-1 w-full" />

							{saved_schedule.schedule.courses.map((course, courseIndex) => (
								<div
									key={courseIndex}
									className="text-extrabold bg-green-400 dark:bg-green-600 p-1 rounded-lg w-full text-center my-1"
								>
									{course.courseCode} - {course.sectionCode}
								</div>
							))}
							<div className="text-lg font-bold">
								Tuition cost: ${calculateTotalCost(saved_schedule)}
							</div>
						</button>
					))}
				</div>
				<Modal
					dismissible
					show={modalProps.openModal === 'dismissible'}
					onClose={() => setOpenModal(undefined)}
				>
					<Modal.Header>{modalProps.schedule?.name} | Total Cost: ${calculateTotalCost(modalProps.schedule)}</Modal.Header>
					<Modal.Body>
						<div className="space-y-2">
							{/* Table to display course information */}
							<div className="bg-white dark:bg-gray-800">
								<table className="min-w-full leading-normal">
									<thead>
										<tr>
											<th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-left text-xs font-bold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
												Name
											</th>
											<th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-left text-xs font-bold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
												Section
											</th>
											<th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-left text-xs font-bold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
												Credits
											</th>
											<th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-left text-xs font-bold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
												Professor
											</th>
										</tr>
									</thead>
									<tbody>
										{modalProps.schedule?.schedule.courses.map(
											(course, index) => (
												<tr key={index}>
													<td className="px-2 py-1 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-900 dark:text-gray-200">
														{course.courseName}
													</td>
													<td className="px-2 py-1 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-900 dark:text-gray-200">
														{course.courseCode} - {course.sectionCode}
													</td>
													<td className="px-2 py-0.5 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-900 dark:text-gray-200">
														{course.credits}
													</td>
													<td className="px-2 py-0.5 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-900 dark:text-gray-200">
														{course.professor}
													</td>
												</tr>
											),
										)}
									</tbody>
								</table>
							</div>

							<div>
								{/* Your WeeklyCalendar component */}
								<WeeklyCalendar
									schedule={modalProps.schedule?.schedule}
									term={modalProps.schedule?.term || 'No Term'}
									year={modalProps.schedule?.year.toString() || 'No Year'}
									isInModal={true}
								/>
							</div>
							
							<button
								className="bg-red-700 border-2 border-red-700 rounded-lg py-1 px-2 text-white hover:bg-red-800"
								onClick={() => {
								if (modalProps.schedule) {
									deleteSchedule(modalProps.schedule.id);
								}
								}}
								>
								Delete
							</button>
						</div>
					</Modal.Body>
				</Modal>
			</div>
		</div>
	);
};

export default SavedScheduleView;
