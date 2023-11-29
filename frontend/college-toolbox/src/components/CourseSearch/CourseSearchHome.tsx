import React, { useState, useEffect } from 'react';
import SearchBar from '../CourseSearch/SearchBar';
import CourseList from '../CourseSearch/CourseList';
import type { CourseSearchSection } from '../../types/entities';
import { API_URL } from '../../app/constants';
import { useStore } from '@nanostores/react';
import { $selectedTermYear } from '../../lib/courses';
import { getDefaultAcademicYearOptions } from '../../lib/data';

export interface SearchQuery {
	query: string;
}

const CourseSearchHome: React.FC = () => {
	const [courses, setCourses] = useState<CourseSearchSection[]>([]);
	let academicTermYear = useStore($selectedTermYear);
	const defaultAcademicTermYear = getDefaultAcademicYearOptions();
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
					term: academicTermYear.term,
					year: Number(academicTermYear.year),
				}),
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
	useEffect(()=>{
		setCourses([]);
	},[academicTermYear]);

	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
	}, []);
	return (
		<div className="flex flex-col mr-2 ml-2 w-[98%] gap-2">
			<SearchBar
				onSubmit={submitSearchQuery}
				term={isClient ? academicTermYear.term : defaultAcademicTermYear.term}
				year={isClient ? academicTermYear.year : defaultAcademicTermYear.year}
			/>
			<CourseList courses={courses} />
		</div>
	);
};

export default CourseSearchHome;
