import React, { useState, useEffect } from 'react';
import WeeklyCalendar from './WeeklyCalendar';
import ExportCalendarButton from './ExportCalendarButton';
import ScheduleOptions from './ScheduleOptions';
import ScheduleNavigator from './ScheduleNavigator';
import type {
	FilteredCourse,
	GeneratedSchedule,
	ScheduleGenerationOptions,
} from '../../types/entities';
import GenerateScheduleButton from './GenerateScheduleButton';
import { getDefaultOptions } from '../../lib/data';

interface ScheduleHubProps {}

const ScheduleHub: React.FC<ScheduleHubProps> = () => {
	const [selectedCourses, setSelectedCourses] = useState<FilteredCourse[]>([]);
	const [schedules, setSchedules] = useState<GeneratedSchedule[]>([]);
	const [currentScheduleIdx, setCurrentScheduleIdx] = useState<number>(0);
	const [options, setOptions] = useState<ScheduleGenerationOptions>(
		getDefaultOptions(),
	);
useEffect(() => {
		setCurrentScheduleIdx(0);
	}, [schedules]);

	return (
		<section className="grid grid-cols-10 w-full gap-2 mx-2">
			<div className="col-span-3">
				<div className="flex items-center justify-center ">
					<ExportCalendarButton
						schedule={schedules[currentScheduleIdx]}
						term={options.term}
						year={options.year}
					/>
					<GenerateScheduleButton
						options={options}
						setSchedules={setSchedules}
						courses={selectedCourses}
						term={options.term}
						year={options.year}
					/>
				</div>
				{schedules && schedules.length > 0 && (
					<ScheduleNavigator
						setState={setCurrentScheduleIdx}
						currentState={currentScheduleIdx}
						totalItems={schedules.length}
					/>
				)}
				<ScheduleOptions
					courses={selectedCourses}
					setCourses={setSelectedCourses}
					options={options}
					setOptions={setOptions}
				/>
			</div>
			<div className="col-span-7">
				<WeeklyCalendar
					schedule={schedules[currentScheduleIdx]}
					term={options.term}
					year={options.year}
				/>
			</div>
		</section>
	);
};

export default ScheduleHub;
