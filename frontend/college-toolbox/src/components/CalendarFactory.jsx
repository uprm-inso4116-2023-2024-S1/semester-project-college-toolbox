import React from 'react';
import { Calendar } from 'react-calendar';
import { isSameDay, addDays, isAfter } from 'date-fns';

const CalendarFactory = ({
	userPreferences,
	scholarshipDeadlines,
	onDateChange,
	deadlineOptions, // Add deadlineOptions as a prop
}) => {
	const { calendarType = 'gregory', otherPreferences = {} } = userPreferences;
	const { initialDate = new Date() } = otherPreferences;

	return (
		<Calendar
			onChange={onDateChange}
			value={initialDate}
			tileContent={({ date }) => {
				if (isExtraDay(date, scholarshipDeadlines)) {
					return (
						<p style={{ color: deadlineOptions?.color || 'red' }}>
							{deadlineOptions?.text || 'DL'}
						</p>
					);
				}
			}}
			calendarType={calendarType}
		/>
	);
};

const isExtraDay = (date, scholarshipDeadlines) => {
	const midnightDate = new Date(date);
	midnightDate.setHours(0, 0, 0, 0);

	return scholarshipDeadlines.some((deadline) => {
		const midnightDeadline = new Date(deadline);
		midnightDeadline.setHours(0, 0, 0, 0);

		return (
			isAfter(midnightDate, midnightDeadline) &&
			isSameDay(midnightDate, addDays(midnightDeadline, 1))
		);
	});
};

export default CalendarFactory;
