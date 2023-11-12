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
import { getDefaultScheduleOptions } from '../../lib/data';
import { getDefaultAcademicYearOptions } from '../../lib/data';
import { useStore } from '@nanostores/react';
import { $selectedTermYear, $storedCourses } from '../../lib/courses';
interface ScheduleHubProps {}

const ScheduleHub: React.FC<ScheduleHubProps> = () => {
	let selectedCourses = useStore($storedCourses);
	let academicTermYear = useStore($selectedTermYear);
	const defaultAcademicTermYear = getDefaultAcademicYearOptions()
	const [schedules, setSchedules] = useState<GeneratedSchedule[]>([]);
	const [currentScheduleIdx, setCurrentScheduleIdx] = useState<number>(0);
	const [options, setOptions] = useState<ScheduleGenerationOptions>(
		getDefaultScheduleOptions(),
	);
	const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
useEffect(() => {
		setCurrentScheduleIdx(0);
	}, [schedules]);

	return (
		<section className="grid grid-cols-10 w-full gap-2 mx-2">
			<div className="col-span-3">
				<div className="flex items-center justify-center ">
					<ExportCalendarButton
						schedule={schedules[currentScheduleIdx]}
						term={academicTermYear.term}
						year={academicTermYear.year}
					/>
					<GenerateScheduleButton
						options={options}
						setSchedules={setSchedules}
						courses={selectedCourses}
						term={academicTermYear.term}
						year={academicTermYear.year}
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
					options={options}
					setOptions={setOptions}
				/>
			</div>
			<div className="col-span-7">
				<WeeklyCalendar
					schedule={schedules[currentScheduleIdx]}
					term={isClient ? academicTermYear.term: defaultAcademicTermYear.term}
					year={isClient ? academicTermYear.year: defaultAcademicTermYear.year}
				/>
			</div>
		</section>
	);
};

export default ScheduleHub;
