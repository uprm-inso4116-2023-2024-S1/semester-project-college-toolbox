import React, { useState, useEffect } from 'react';
import { API_URL } from '../../app/constants';
import SearchBar from '../../components/SavedSchedules/SearchBar';
import type { SavedScheduleModel } from '../../types/entities';
import SavedScheduleView from './SavedScheduleView';
import { $selectedTermYear } from '../../lib/courses';
import { useStore } from '@nanostores/react';
import { $authToken } from '../../lib/profile';

const SavedScheduleHub: React.FC = () => {
	const [savedSchedules, setSavedSchedules] = useState<SavedScheduleModel[]>(
		[],
	);
	const academicTermYear = useStore($selectedTermYear);

	const handleSuggestionsUpdate = (suggestions: SavedScheduleModel[]) => {
		setSavedSchedules(suggestions);
	};

	const handleDeleteSchedule = (deletedScheduleId: number) => {
		setSavedSchedules((currentApplications) =>
			currentApplications.filter(
				(schedule) => schedule.id !== deletedScheduleId,
			),
		);
	};

	const handleSearchSchedules = async (value: string) => {
		try {
			const requestBody = {
				prefix: value,
				term: academicTermYear.term,
				year: +academicTermYear.year,
			};

			const response = await fetch(`${API_URL}/schedules/filter/prefix`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${$authToken.get()}`,
				},
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				throw new Error(`Validation request failed: ${response.statusText}`);
			}

			const data = await response.json();
			setSavedSchedules(data);
		} catch (error) {
			console.error('Error fetching applications:', error);
		}
		console.log(value);
	};

	useEffect(() => {
		handleSearchSchedules('');
	}, []);

	return (
		<div className="Saved-Schedule-Hub-container">
			<SearchBar
				onSearch={handleSearchSchedules}
				onSuggestionsUpdate={handleSuggestionsUpdate}
			/>
			<div className="gap-4 mx-4 mt-4">
				<div>
					<SavedScheduleView
						applications={savedSchedules}
						onDeleteSchedule={handleDeleteSchedule}
					/>
				</div>
			</div>
		</div>
	);
};

export default SavedScheduleHub;
