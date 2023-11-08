import React, { useState } from 'react';
import SearchBar from '../CourseSearch/SearchBar';
import CourseList from '../CourseSearch/CourseList';
import type { CourseSectionSchedule } from '../../types/entities';
import { API_URL } from '../../app/constants';

export interface SearchQuery {
	query: string;
	term: string;
	year: string;
}

const CourseSearchHome: React.FC = () => {
	const [courses, setCourses] = useState<CourseSectionSchedule[]>([]);

	const submitSearchQuery = async (searchQuery: SearchQuery) => {
		if (!searchQuery.query) {
			return;
		}
		try {
			const response = await fetch(`${API_URL}/course_search`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...searchQuery,
					year: Number(searchQuery.year),
				}),
				credentials: 'include',
			});

			if (!response.ok) {
				// Handle error, show a message, or throw an exception
				console.error('Failed to search for courses');
				return;
			}
			// update the queried courses
			const searchResponse = await response.json();
			setCourses(searchResponse.course_section_schedules);
		} catch (error) {
			console.error('An error occurred:', error);
		} finally {
		}
	};
	return (
		<div className="flex flex-col mr-2 ml-2 w-[98%] gap-2">
			<SearchBar onSubmit={submitSearchQuery} />
			<CourseList courses={courses} />
		</div>
	);
};

export default CourseSearchHome;
