import React, { useState } from 'react';
import { getDefaultOptions } from '../../lib/data';
import type { SearchQuery } from './CourseSearchHome';


interface SearchBarProps {
  onSubmit: (searchQuery: SearchQuery) => void; // The onSubmit prop function
}
const SearchBar: React.FC<SearchBarProps> = ({ onSubmit }) => {
	const currentYear = new Date().getFullYear();
	const [searchQuery, setSearchQuery] = useState<SearchQuery>({...getDefaultOptions(), query:""});
	
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setSearchQuery({
			...searchQuery,
			[e.target.name]: e.target.value,
		});
	};


	// The handleSubmit function that calls the passed onSubmit function
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault(); // Prevent the default form submit action
		onSubmit(searchQuery); // Call the onSubmit function prop with the current state
	};
	return (
		<form onSubmit={handleSubmit}>
			<div className="flex">
				<div>
					<select
						id="term"
						name="term"
						className="rounded-l-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-32 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						value={searchQuery.term}
						onChange={handleInputChange}
						required
					>
						<option value="1erSem">Fall</option>
						<option value="2doSem">Spring</option>
						<option value="1erVer">First Summer</option>
						<option value="2doVer">Second Summer</option>
					</select>
				</div>
				<div>
					<select
						id="year"
						name="year"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm	 focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-32 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						value={searchQuery.year}
						onChange={handleInputChange}
						required
					>
						<option value={`${currentYear - 1}`}>
							{currentYear - 1}-{currentYear}
						</option>
						<option value={`${currentYear}`}>
							{currentYear}-{currentYear + 1}
						</option>
					</select>
				</div>
				<div className="relative w-full">
					<input
						type="search"
						id="query"
						name="query"
						className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus-border-blue-500"
						placeholder="Search Courses..."
						value={searchQuery.query}
						onChange={handleInputChange}
						required
					/>
					<button
						type="submit"
						className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-r-lg border border-blue-700 hover-bg-blue-800 focus-ring-4 focus-outline-none focus-ring-blue-300 dark:bg-blue-600 dark:hover-bg-blue-700 dark:focus-ring-blue-800"
					>
						<svg
							className="w-4 h-4"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 20 20"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
							/>
						</svg>
						<span className="sr-only">Search</span>
					</button>
				</div>
			</div>
		</form>
	);
};

export default SearchBar;
