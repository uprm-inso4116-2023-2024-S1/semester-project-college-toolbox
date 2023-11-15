import React from 'react';
import type { CourseSearchSection } from '../../types/entities';
import { convertToAmPm } from '../../lib/data';
import { useStore } from '@nanostores/react';
import { $storedCourses } from '../../lib/courses';

// Update the props type to include the courses array
type CourseListProps = {
	courses: CourseSearchSection[];
};

// Update the component to accept the courses prop
const CourseList: React.FC<CourseListProps> = ({ courses }) => {
	function getDaysString(course: CourseSearchSection) {
		const days = course.schedules.map((block) => block.days);
		return days.join('');
	}
	function getRooms(course: CourseSearchSection) {
		const rooms: string[] = [];
		course.schedules
			.map((block) => block.room)
			.forEach((room) => {
				if (!rooms.includes(room)) rooms.push(room);
			});
		return rooms;
	}
	function getTimes(course: CourseSearchSection) {
		const times: string[] = [];
		course.schedules
			.map(
				(block) =>
					`${convertToAmPm(block.startTime)}-${convertToAmPm(block.endTime)}`,
			)
			.forEach((time) => {
				if (!times.includes(time)) times.push(time);
			});
		return times;
	}

	let selectedCourses = useStore($storedCourses);
	function addCourse(course: CourseSearchSection) {
		let courseString = `${course.courseCode}`;
		if (course.sectionCode.trim() !== '') {
			courseString += `-${course.sectionCode}`;
		}
		const newCourses = [...selectedCourses];
		const prevIdx = newCourses.findIndex(
			(course) => course.code.split('-')[0] == course.code,
		);
		if (prevIdx != -1) {
			newCourses[prevIdx] = { code: courseString };
		} else {
			newCourses.push({ code: courseString });
		}
		// Save courses to local storage
		$storedCourses.set(newCourses);
	}
	function isCourseSelected(course: CourseSearchSection) {
    return selectedCourses.some(
      selectedCourse => selectedCourse.code === course.courseCode + '-' + course.sectionCode
    );
  }

	return (
		<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
			<table className="w-full text-sm text-left text-gray-500 dark:text-white">
				<thead className="text-xs text-gray-700 dark:text-white uppercase bg-gray-50 dark:bg-gray-700">
					<tr>
						<th scope="col" className="px-4 py-3 ">
							Course Code
						</th>
						<th scope="col" className="px-4 py-3">
							Course Name
						</th>
						<th scope="col" className="px-4 py-3">
							Section
						</th>
						<th scope="col" className="px-4 py-3">
							Professor
						</th>
						<th scope="col" className="px-4 py-3">
							Credits
						</th>
						<th scope="col" className="px-4 py-3">
							Room
						</th>
						<th scope="col" className="px-4 py-3">
							Days
						</th>
						<th scope="col" className="px-4 py-3">
							Time
						</th>
						<th scope="col" className="px-0 py-3">
							<span className="sr-only">Save to Schedule</span>
						</th>
					</tr>
				</thead>
				<tbody>
					{courses.map((course, index) => (
						<tr
							key={`${course.courseCode}-${course.sectionCode}-${index}`}
							className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
						>
							<th
								scope="row"
								className="px-4 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
							>
								{course.courseCode}
							</th>
							<td className="px-4 py-4 dark:text-white">{course.courseName}</td>
							<td className="px-4 py-4 dark:text-white">
								{course.sectionCode}
							</td>
							<td className="px-4 py-4 dark:text-white">{course.professor}</td>
							<td className="px-4 py-4 dark:text-white">{course.credits}</td>
							<td className="px-4 py-4 dark:text-white">
								{getRooms(course).join(', ')}
							</td>
							<td className="px-4 py-4 dark:text-white">
								{getDaysString(course)}
							</td>
							<td className="px-4 py-4 dark:text-white">
								{getTimes(course).join(', ')}
							</td>
							<td className="px-0 py-4 text-right">
								<button
									type="button"
									onClick={() => addCourse(course)}
									disabled={isCourseSelected(course)}
									className={`text-white font-medium rounded-full text-sm px-4 py-2.5 text-center mr-2 mb-2 ${
										isCourseSelected(course)
											? 'bg-gray-400 cursor-not-allowed'
											: 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
									}`}
								>
									{isCourseSelected(course) ? 'Added' : 'Add to Schedule'}
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default CourseList;
