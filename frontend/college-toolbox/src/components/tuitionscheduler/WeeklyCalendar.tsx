import { Modal } from 'flowbite-react';
import './WeeklyCalendar.scss';
import {
	convertToAmPm,
	getCurrentTimeInMinutes,
	subtract24HourTimes,
	termEnumToString,
} from '../../lib/data';
import type { CourseSectionSchedule, GeneratedSchedule, SpaceTimeBlock } from '../../types/entities';
import React, { useState } from 'react';

interface WeeklyCalendarProps {
	schedule: GeneratedSchedule | undefined;
	term: string;
	year: string;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
	schedule,
	term,
	year,
}) => {
	const shortDaysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const daysOfWeek = [
		'Monday',
		'Tueday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday',
	];
	const hoursOffsetInMinutes = 6 * 60; // Adjusted offset to start at 6:00 am
	const currentTimeRow =
		getCurrentTimeInMinutes() - hoursOffsetInMinutes > 0
			? Math.floor((getCurrentTimeInMinutes() - hoursOffsetInMinutes) / 30) + 1
			: 1;
	const currentTimeTop =
		getCurrentTimeInMinutes() - hoursOffsetInMinutes > 0
			? (((getCurrentTimeInMinutes() - hoursOffsetInMinutes) % 30) / 30) * 100
			: 0;
	const currentDayCol = ((new Date().getDay() - 1) % 7) + 3;

	const [openModal, setOpenModal] = useState<string | undefined>();
	const [calEvent, setCalEvent] = useState<CourseSectionSchedule | undefined>();
	const modalProps = { openModal, setOpenModal, calEvent, setCalEvent };

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
						onClick={() => {
							modalProps.setCalEvent(course);
							modalProps.setOpenModal('dismissible');
						}}
					>
						{course.courseCode}-{course.sectionCode}
						<br />
						Room: {block.room}
					</div>
				);
			}
			return (
				<React.Fragment key={`block-fragment ${idx}`}>
					<div
						className="event start"
						style={{
							gridColumn: dayColumn,
							gridRow: `${timeRow} / span ${hoursDuration}`,
						}}
						onClick={() => {
							modalProps.setCalEvent(course);
							modalProps.setOpenModal('dismissible');
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
						onClick={() => {
							modalProps.setCalEvent(course);
							modalProps.setOpenModal('dismissible');
						}}
					/>
				</React.Fragment>
			);
		});
	};

	return (
		<div>
			<div className="container">
				<div className="title">
					{termEnumToString(term)} {year} Semester
				</div>
				<div className="days">
					<div className="filler" />
					<div className="filler" />
					{shortDaysOfWeek.map((day, index) => (
						<div
							key={`day-header ${index}`}
							className={`day${index + 3 === currentDayCol ? ' current' : ''}`}
						>
							{day}
						</div>
					))}
				</div>
				<div className="content">
					{Array.from({ length: 18 * 2 }, (_, index) => (
						<div
							key={`hours ${index + 1}`}
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
							key={`day-col ${index + 1}`}
							className={`col${index > 4 ? ' weekend' : ''}`}
							style={{ gridColumn: index + 3 }}
						></div>
					))}
					{Array.from({ length: 18 * 2 + 1 }, (_, index) => (
						<div
							key={`day-row ${index + 1}`}
							className="row"
							style={{ gridRow: index + 1 }}
						></div>
					))}
					{schedule && schedule.courses.map(convertToCalendarEvents)}
					<div
						key={'curr-time'}
						className="current-time"
						style={{
							gridColumn: currentDayCol,
							gridRow: currentTimeRow,
							top: `${currentTimeTop}%`,
						}}
					>
						<div className="circle" />
					</div>
				</div>
			</div>
			<Modal
				dismissible
				show={modalProps.openModal === 'dismissible'}
				onClose={() => modalProps.setOpenModal(undefined)}
			>
				<Modal.Header>Course Information</Modal.Header>
				<Modal.Body>
					<div className="space-y-6">
						<ul>
							<li>Course Code: {modalProps.calEvent?.courseCode}</li>
							<li>Course Name: {modalProps.calEvent?.courseName}</li>
							<li>Section: {modalProps.calEvent?.sectionCode}</li>
							<li>Professor: {modalProps.calEvent?.professor}</li>
							<li>Credits: {modalProps.calEvent?.credits}</li>
							<ol key={`time-list-${modalProps.calEvent?.courseCode}`}>
								Times:
								{modalProps.calEvent?.timeBlocks?.map((block, idx) => (
									<li className="p-1" key={`modal-time ${idx}`}>
										<ul className="border border-gray-300 rounded p-1">
											<li>Room: {block.room}</li>
											<li>Building: <a className="text-blue-700 hover:underline" href={block.location}>{block.building}</a></li>
											<li>Day: {daysOfWeek[block.day]}</li>
											<li>Start Time: {convertToAmPm(block.startTime)}</li>
											<li>End Time: {convertToAmPm(block.endTime)}</li>
										</ul>
									</li>
								))}
							</ol>
						</ul>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default WeeklyCalendar;
