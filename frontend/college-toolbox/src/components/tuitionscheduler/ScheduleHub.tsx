import React, { useState } from 'react';
import { API_URL } from '../../app/constants';
import WeeklyCalendar from './WeeklyCalendar';
import ExportCalendarButton from './ExportCalendarButton';
import ScheduleOptions from './CourseList.jsx';
import type { GeneratedSchedule, ScheduleFilters } from '../../types/entities';
import GenerateScheduleButton from './GenerateScheduleButton';


interface ScheduleHubProps {
}

const ScheduleHub: React.FC<ScheduleHubProps> = () => {
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [schedules, setSchedules] = useState<GeneratedSchedule[]>([]);
    const [currentScheduleIdx, setCurrentScheduleIdx] = useState<number>(0);
		const [filters, setFilters] = useState<ScheduleFilters>({customFilters:[]});

  return (
		<section className="w-full pt-2">

		<WeeklyCalendar schedule={schedules[currentScheduleIdx]} term='1erSem' year='2023'/>
		<ScheduleOptions courses={selectedCourses} setCourses={setSelectedCourses} />
		<ExportCalendarButton section_ids={[2191,1378,1334]} term='1erSem' year='2023' />
		<GenerateScheduleButton filters={filters} setSchedules= {setSchedules} courses={selectedCourses} term='1erSem' year='2023'/>
		</section>
  );
};

export default ScheduleHub;
