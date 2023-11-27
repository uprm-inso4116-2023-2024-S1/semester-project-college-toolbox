import React, { useState } from 'react';
import { API_URL } from '../../app/constants';
import type { GeneratedSchedule } from '../../types/entities';
import { isLoggedIn } from '../../lib/profile';
import { Modal } from 'flowbite-react';
import { getCookie, url } from '../../lib/data';

interface SaveScheduleButtonProps {
	schedule: GeneratedSchedule | undefined;
	term: string;
	year: string;
}

const SaveScheduleButton: React.FC<SaveScheduleButtonProps> = ({
	schedule,
	term,
	year,
}) => {
	const [openModal, setOpenModal] = useState<string | undefined>(undefined);
	const [name, setName] = useState('');

	const handleSaveClick = async () => {
		try {
			if (!schedule) return;

			const section_ids = schedule.courses.map((course) => course.sectionId);

			const response = await fetch(`${API_URL}/save_schedule`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					course_section_ids: section_ids,
					name,
					term,
					year,
				}),
				credentials: 'include',
			});

			if (!response.ok) {
				// Handle error, show a message, or throw an exception
				console.error('Failed to fetch schedule data');
				return;
			}

			await response.json();

			setOpenModal(undefined);
		} catch (error) {
			console.error('An error occurred:', error);
		} finally {
		}
	};

	return (
		<>
			<button
				type="button"
				className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-gray-400 disabled:dark:bg-gray-500"
				onClick={() => {
					if (isLoggedIn.get() == 'false') {
						window.location.href = url('authentication/sign-in');
					} else {
						setOpenModal('dismissible');
					}
				}}
				disabled={!schedule}
			>
				Save
			</button>
			<Modal
				dismissible
				show={openModal === 'dismissible'}
				onClose={() => setOpenModal(undefined)}
			>
				<Modal.Header>Name schedule:</Modal.Header>
				<Modal.Body>
					<div>
						<input
							type="text"
							placeholder="Enter name..."
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="border border-gray-300 p-2 mb-4 w-full dark:bg-gray-200 dark:text-black"
						/>
						<button
							className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-gray-400 disabled:dark:bg-gray-500"
							onClick={handleSaveClick}
						>
							Submit
						</button>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default SaveScheduleButton;
