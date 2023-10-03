import React from 'react';
import './WeeklyCalendar.scss';
import {
	convertToAmPm,
	getCurrentTimeInMinutes,
	subtract24HourTimes,
	termEnumToString,
} from '../lib/data';
import type { CourseSectionSchedule, SpaceTimeBlock } from '../types/entities';

interface WeeklyCalendarProps {
	courses: CourseSectionSchedule[];
	term: string;
	year: string;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
	courses,
	term,
	year,
}) => {
	const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const hoursOffsetInMinutes = 4 * 60 + 30; // we want to "zero" at 5:30 am, such that 5:30 corresponds to column 1
	const currentTimeRow =
		getCurrentTimeInMinutes() - hoursOffsetInMinutes > 0
			? Math.floor((getCurrentTimeInMinutes() - hoursOffsetInMinutes) / 60)
			: 1;
	const currentDayCol = ((new Date().getDay() - 1) % 7) + 3; // subtract 1 since in getDay sunday is 0
	//TODO: make this display courses with 10 minute increment precision
	const convertToEvents = (course: CourseSectionSchedule) => {
		return course.timeBlocks.map((block: SpaceTimeBlock, idx: number) => {
			const hoursOffsetInMinutes = 4 * 60 + 30; // we want to "zero" at 5:30 am, but we want to start at row 1
			const dayColumn: number = block.day + 3; // 3 is the monday column
			const timeRow: number = Math.ceil(
				(subtract24HourTimes('00:00', block.startTime) - hoursOffsetInMinutes) /
					60,
			); // 1 corresponds to 5:30 am
			if (timeRow < 0) {
				// return early if we can't show this time in the calendar
				return <></>;
			}
			const hoursDuration: number = Math.ceil(
				subtract24HourTimes(block.startTime, block.endTime) / 60,
			);
			return (
				<div
					key={`block ${idx}`}
					className="event"
					style={{
						gridColumn: dayColumn,
						gridRow: `${timeRow} / span ${hoursDuration}`,
					}}
				>
					<b>
						{course.courseCode}-{course.sectionCode}
					</b>
					<br />
					Room: {block.room}
				</div>
			);
		});
	};

	return (
		<div className="weeklyCalendar">
			<div className="container">
				<div className="title">
					{termEnumToString(term)} {year} Semester
				</div>
				<div className="days">
					<div className="filler" />
					<div className="filler" />
					{daysOfWeek.map((day, index) => (
						<div
							key={index}
							className={`day${index + 3 === currentDayCol ? ' current' : ''}`}
						>
							{day}
						</div>
					))}
				</div>
				<div className="content">
					{/*  THIS CODE would show all hours, but generally we just want to show the hours where courses would be given
							 Leaving the code in for a possible toggle option in the future.
					{Array.from({ length: 23 }, (_, index) => (
						<div key={index + 1} className="time" style={{ gridRow: index + 1 }}>
							{convertToAmPm(`${String(index+1).padStart(2)}:00`)}
						</div>
					))} */}
					{Array.from({ length: 18 }, (_, index) => (
						<div
							key={index + 6}
							className="time"
							style={{ gridRow: index + 1 }}
						>
							{convertToAmPm(`${String(index + 6).padStart(2)}:30`)}
						</div>
					))}
					<div className="filler-col" />
					{Array.from({ length: 7 }, (_, index) => (
						<div
							key={index}
							className={`col${index > 4 ? ' weekend' : ''}`}
							style={{ gridColumn: index + 3 }}
						></div>
					))}
					{Array.from({ length: 18 }, (_, index) => (
						<div key={index + 1} className="row" style={{ gridRow: index + 1 }}>
							<div className="line" />
						</div>
					))}
					{courses.map(convertToEvents)}
					<div
						className="current-time"
						style={{ gridColumn: currentDayCol, gridRow: currentTimeRow }}
					>
						<div className="circle" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default WeeklyCalendar;
