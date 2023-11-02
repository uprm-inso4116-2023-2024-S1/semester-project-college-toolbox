import { Modal } from 'flowbite-react';
import { $isDarkMode } from '../../lib/theme.ts';
import {
	convertToAmPm,
	getCurrentTimeInMinutes,
	subtract24HourTimes,
	termEnumToString,
} from '../../lib/data';
import type {
	CourseSectionSchedule,
	GeneratedSchedule,
	SpaceTimeBlock,
} from '../../types/entities';
import React, { useState } from 'react';
import { useStore } from '@nanostores/react';

interface WeeklyCalendarProps {
	schedule: GeneratedSchedule | undefined;
	term: string;
	year: string;
}

function courseCodeToColor(
	str: string,
	minColor?: number,
	maxColor?: number,
): string {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	let color = '#';

	// Minimum and maximum color values to avoid extreme dark or bright colors
	const MIN_VALUE = minColor ?? 0; // closer to 0 is darker
	const MAX_VALUE = maxColor ?? 255; // closer to 255 is brighter

	for (let j = 0; j < 3; j++) {
		let value = (hash >> (j * 8)) & 0xff;

		// Map the value to the desired range
		value = MIN_VALUE + (value % (MAX_VALUE - MIN_VALUE));
		color += ('00' + value.toString(16)).slice(-2);
	}
	return color;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
	schedule,
	term,
	year,
}) => {
	const isDarkMode = useStore($isDarkMode);
	const shortDaysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const daysOfWeek = [
		'Monday',
		'Tuesday',
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
	const currentDayCol = ((new Date().getDay() + 6) % 7) + 3; // Sunday

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
			const lightModeColor = courseCodeToColor(course.courseCode, 120, 255);
			const darkModeColor = courseCodeToColor(course.courseCode, 5, 200);
			if (remainingMinutes == 0) {
				return (
					<div
						key={`block ${idx}`}
						className="z-10 rounded-t-[5px] p-[5px] mr-[5px] font-bold text-[70%] text-black dark:text-white rounded-b-[5px] hover:cursor-pointer"
						style={{
							gridColumn: dayColumn,
							gridRow: `${timeRow} / span ${hoursDuration}`,
							backgroundColor:
								isDarkMode === 'true' ? darkModeColor : lightModeColor,
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
						className="rounded-t-[5px] p-[5px] mr-[5px] font-bold text-[70%] text-black dark:text-white hover:cursor-pointer z-20 !rounded-b-none"
						style={{
							gridColumn: dayColumn,
							gridRow: `${timeRow} / span ${hoursDuration}`,
							backgroundColor:
								isDarkMode === 'true' ? darkModeColor : lightModeColor,
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
						className={`z-10 p-[5px] mr-[5px] font-bold text-[70%] text-black dark:text-white hover:cursor-pointer !rounded-t-none rounded-b-[5px]`}
						style={{
							gridColumn: dayColumn,
							gridRow: `${timeRow + hoursDuration} / span 1`,
							height: `${(remainingMinutes / 30) * 100}%`,
							backgroundColor:
								isDarkMode === 'true' ? darkModeColor : lightModeColor,
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
		<div className="bg-white dark:bg-gray-800 box-border">
			<div className="flex-1 w-full grid grid-rows-[3em_3em_auto]">
				<div className="bg-[#217346] text-center grid place-content-center text-white dark:text-gray-50 sticky top-0 z-10">
					{termEnumToString(term)} {year} Semester
				</div>
				<div className="bg-gray-100 dark:bg-gray-600 grid place-content-center text-center grid-cols-[4em_10px_repeat(7,1fr)] sticky top-12 z-10 border-b-2 border-gray-200 dark:border-gray-500 text-black dark:text-gray-50">
					<div />
					<div />
					{shortDaysOfWeek.map((day, index) => (
						<div
							key={`day-header ${index}`}
							className={`border-l border-gray-300 dark:border-gray-400 ${
								index + 3 === currentDayCol ? ' font-bold' : ''
							}`}
						>
							{day}
						</div>
					))}
				</div>
				<div className="grid grid-cols-[4em_10px_repeat(7,1fr)] grid-rows-[repeat(37,2em)] ">
					{Array.from({ length: 18 * 2 }, (_, index) => (
						<div
							key={`hours ${index + 1}`}
							className="col-span-1 text-right self-end relative bottom-[-1ex] text-gray-800 dark:text-gray-200 text-xs pr-2"
							style={{ gridRow: index + 1 }}
						>
							{index % 2 === 0
								? convertToAmPm(
										`${String(Math.floor(index / 2) + 6).padStart(2)}:30`,
								  )
								: ''}
						</div>
					))}
					<div className="col-span-1 row-span-full col-start-2 border-r border-gray-200 dark:border-gray-500" />
					{Array.from({ length: 7 }, (_, index) => (
						<div
							key={`day-col ${index + 1}`}
							className={`border-r border-gray-200 dark:border-gray-500 col-span-1 row-span-full${
								index > 4 ? '  bg-gray-100 dark:bg-gray-600' : ''
							}`}
							style={{ gridColumn: index + 3 }}
						></div>
					))}
					{Array.from({ length: 18 * 2 + 1 }, (_, index) => (
						<div
							key={`day-row ${index + 1}`}
							className="z-0 col-start-2 col-span-full border-b-2 border-gray-200 dark:border-gray-500 relative"
							style={{ gridRow: index + 1 }}
						></div>
					))}
					{schedule && schedule.courses.map(convertToCalendarEvents)}
					<div
						key={'curr-time'}
						className="z-30 border-t-2 border-red-500 relative"
						style={{
							gridColumn: currentDayCol,
							gridRow: currentTimeRow,
							top: `${currentTimeTop}%`,
						}}
					>
						<div className="w-[12px] h-[12px] border border-solid border-red-500 rounded-full bg-red-500 relative top-[-7px] left-[-6px]" />
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
					<div className="space-y-6 dark:text-white">
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
											<li>
												Building:{' '}
												<a
													className="text-blue-700 hover:underline"
													href={block.location}
												>
													{block.building}
												</a>
											</li>
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
