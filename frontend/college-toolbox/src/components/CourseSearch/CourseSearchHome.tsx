import React from 'react';
import SearchBar from '../CourseSearch/SearchBar';
import CourseList from '../CourseSearch/CourseList';

const CourseSearchHome: React.FC = () => {
	return (
		<div className="flex flex-col mr-2 ml-2 w-[98%] gap-2">
			<SearchBar />
			<CourseList
				courses={[
					{
						code: 'CIIC3015',
						name: 'INTRO A LA PROG DE COMP I',
						section: '036',
						professor: 'HEIDY SIERRA GIL',
						credits: 4,
						room: 'N/A',
						days: 'MJ',
						time: '09:00AM-10:15AM',
					},
					{
						code: 'CIIC3016',
						name: 'DATA STRUCTURES',
						section: '089',
						professor: 'JOHN DOE',
						credits: 3,
						room: '101',
						days: 'TF',
						time: '11:00AM-12:15PM',
					},
					{
						code: 'CIIC3017',
						name: 'COMPUTER ORGANIZATION',
						section: '054',
						professor: 'JANE SMITH',
						credits: 4,
						room: '202B',
						days: 'MW',
						time: '01:00PM-02:15PM',
					},
					{
						code: 'CIIC3018',
						name: 'OPERATING SYSTEMS',
						section: '067',
						professor: 'EDWARD STONE',
						credits: 3,
						room: '309',
						days: 'MW',
						time: '03:30PM-04:45PM',
					},
					{
						code: 'CIIC3019',
						name: 'ALGORITHMS',
						section: '012',
						professor: 'ALICIA KEYS',
						credits: 3,
						room: '105',
						days: 'TF',
						time: '08:00AM-09:15AM',
					},
				]}
			/>
		</div>
	);
};

export default CourseSearchHome;
