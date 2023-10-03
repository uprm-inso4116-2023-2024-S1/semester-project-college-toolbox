
import type React from 'react';
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
	const hoursOffsetInMinutes = 6 * 60; // Adjusted offset to start at 6:00 am
	const currentTimeRow =
		getCurrentTimeInMinutes() - hoursOffsetInMinutes > 0
			? Math.floor((getCurrentTimeInMinutes() - hoursOffsetInMinutes) / 30) + 1
			: 1;
	const currentDayCol = ((new Date().getDay() - 1) % 7) + 3;

	const convertToCalendarEvents = (course: CourseSectionSchedule) => {
		return course.timeBlocks.map((block: SpaceTimeBlock, idx: number) => {
			const dayColumn: number = block.day + 3;
			const timeRow: number =
				Math.floor(
					(subtract24HourTimes('00:00', block.startTime) -
						hoursOffsetInMinutes) /
						30,
				) + 1;
			if (timeRow < 1) {
				// don't render items that don't show in the calendar times
				return <></>;
			}
			const hoursDuration: number = Math.floor(
				subtract24HourTimes(block.startTime, block.endTime) / 30,
			);
			const remainingMinutes: number =
				subtract24HourTimes(block.startTime, block.endTime) % 30;
			if (remainingMinutes == 0) {
				return (
					<div
						key={`block ${idx}`}
						className="event"
						style={{
							gridColumn: dayColumn,
							gridRow: `${timeRow} / span ${hoursDuration}`,
						}}
					>
						{course.courseCode}-{course.sectionCode}
						<br />
						Room: {block.room}
					</div>
				);
			}
			return (
				<>
					<div
						key={`block ${idx}`}
						className="event start"
						style={{
							gridColumn: dayColumn,
							gridRow: `${timeRow} / span ${hoursDuration}`,
						}}
					>
						{course.courseCode}-{course.sectionCode}
						<br />
						Room: {block.room}
					</div>
					<div
						className="event end"
						style={{
							gridColumn: dayColumn,
							gridRow: `${timeRow + hoursDuration} / span 1`,
							height: `${(remainingMinutes / 30) * 100}%`,
						}}
					/>
				</>
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
					{Array.from({ length: 18 * 2 }, (_, index) => (
						<div
							key={index + 1}
							className="time"
							style={{ gridRow: index + 1 }}
						>
							{index % 2 === 0
								? convertToAmPm(
										`${String(Math.floor(index / 2) + 6).padStart(2)}:30`,
								  )
								: ''}
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
					{Array.from({ length: 18 * 2 + 1 }, (_, index) => (
						<div
							key={index + 1}
							className="row"
							style={{ gridRow: index + 1 }}
						></div>
					))}
					{courses.map(convertToCalendarEvents)}
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
