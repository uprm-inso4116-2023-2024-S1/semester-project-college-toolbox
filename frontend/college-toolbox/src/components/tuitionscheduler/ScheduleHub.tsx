import React, { useState, useEffect } from 'react';
import WeeklyCalendar from './WeeklyCalendar';
import ExportCalendarButton from './ExportCalendarButton';
import ScheduleOptions from './ScheduleOptions';
import ScheduleNavigator from './ScheduleNavigator';
import type { FilteredCourse, GeneratedSchedule, ScheduleFilters } from '../../types/entities';
import GenerateScheduleButton from './GenerateScheduleButton';

interface ScheduleHubProps {}

const ScheduleHub: React.FC<ScheduleHubProps> = () => {
	const [selectedCourses, setSelectedCourses] = useState<FilteredCourse[]>([]);
	const [schedules, setSchedules] = useState<GeneratedSchedule[]>([]);
	const [currentScheduleIdx, setCurrentScheduleIdx] = useState<number>(0);
	const [filters, setFilters] = useState<ScheduleFilters>({});
	useEffect(() => {
		setCurrentScheduleIdx(0);
	}, [schedules]);

	return (
		<section className="grid grid-cols-10 w-full pt-2">
			<div className="col-span-3">
				<div className="flex items-center justify-center">
					<ExportCalendarButton
						section_ids={[2191, 1378, 1334]}
						term="1erSem"
						year="2023"
					/>
					<GenerateScheduleButton
						filters={filters}
						setSchedules={setSchedules}
						courses={selectedCourses}
						term="1erSem"
						year="2023"
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
				/>
			</div>
			<div className="col-span-7">
				<WeeklyCalendar
					schedule={schedules[currentScheduleIdx]}
					term="1erSem"
					year="2023"
				/>
			</div>
		</section>
	);
};

export default ScheduleHub;