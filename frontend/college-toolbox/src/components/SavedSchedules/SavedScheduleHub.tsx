import React, { useState, useEffect } from 'react';
import { API_URL } from '../../app/constants';
import SearchBar from '../../components/SavedSchedules/SearchBar';
import type { SavedScheduleModel } from '../../types/entities';
import { getCookie } from '../../lib/data';
import SavedScheduleView from './SavedScheduleView';
import Filters from './Filters';

const SavedScheduleHub: React.FC = () => {
	const [savedSchedules, setSavedSchedules] = useState<SavedScheduleModel[]>(
		[],
	);

	const handleSearchSchedules = async (value: string) => {
		// try {
		//     if (value !== "") {
		//         const requestBody = {
		//             prefix: value
		//         };

		//         const response = await fetch(`${API_URL}/ExistingApplication/filter/prefix`, {
		//             method: 'POST',
		//             headers: {
		//                 'Content-Type': 'application/json',
		//             },
		//             body: JSON.stringify(requestBody),
		//         });

		//         if (!response.ok) {
		//             throw new Error(`Validation request failed: ${response.statusText}`);
		//         }

		//         const data = await response.json();
		//         setApplications(data);
		//     }
		//     else {
		//         setApplications([]);
		//     }
		// } catch (error) {
		//     console.error("Error fetching applications:", error);
		// }
		console.log(value);
	};

	const showAllSavedSchedules = async () => {
		try {
			const response = await fetch(`${API_URL}/get_all_save_schedules`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error(`Validation request failed: ${response.statusText}`);
			}

			const data = await response.json();
			setSavedSchedules(data);
		} catch (error) {
			console.error('Error fetching saved schedules:', error);
		}
	};

	useEffect(() => {
		showAllSavedSchedules();
	}, []);

	return (
		<div className="Saved-Schedule-Hub-container">
			<SearchBar onSearch={handleSearchSchedules} />
			<div className="grid grid-cols-5 gap-4 mx-4 mt-4">
				<div className="col-span-1 ">
					<div className="filters-container">
						<Filters />
					</div>
				</div>
				<div className="col-span-4">
					<SavedScheduleView applications={savedSchedules} />
				</div>
			</div>
		</div>
	);
};

export default SavedScheduleHub;
