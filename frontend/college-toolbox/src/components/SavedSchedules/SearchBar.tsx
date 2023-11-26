import React, { useState, useRef, useEffect } from 'react';
import { API_URL } from '../../app/constants';
import type {
	AcademicYearOptions,
	SavedScheduleModel,
} from '../../types/entities';
import { $selectedTermYear, $storedCourses } from '../../lib/courses';
import { useStore } from '@nanostores/react';

const SearchBar: React.FC<{
	onSearch: (value: string) => void;
	onSuggestionsUpdate: (suggestions: SavedScheduleModel[]) => void;
}> = ({ onSearch, onSuggestionsUpdate }) => {
	const searchRef = useRef<HTMLFormElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [searchValue, setSearchValue] = useState<string>('');
	const [suggestions, setSuggestions] = useState<SavedScheduleModel[]>([]);
	const [isActive, setIsActive] = useState<boolean>(false);
	const academicTermYear = useStore($selectedTermYear);
	const currentYear = new Date().getFullYear();

	const resetSearchBar = () => {
		setIsActive(false);
		setSearchValue('');
		setSuggestions([]);
		searchInputRef.current?.blur();
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		resetSearchBar();
		onSearch(searchValue);
	};

	const handleSuggestionSearch = (
		e: React.FormEvent,
		suggestion_value: string,
	) => {
		e.preventDefault();
		resetSearchBar();
		onSearch(suggestion_value);
	};

	// click handler to check if click is outside the search component
	const handleClickOutside = (event: globalThis.MouseEvent) => {
		if (
			searchRef.current &&
			!searchRef.current.contains(event.target as Node)
		) {
			setIsActive(false);
		}
	};

	useEffect(() => {
		// add click event listener to document to detect outside clicks
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			// cleanup: remove event listener when component is unmounted
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleSuggestionFill = (
		e: React.MouseEvent<HTMLButtonElement>,
		suggestionName: string,
	): void => {
		e.preventDefault();
		setSearchValue(suggestionName);
		generateSuggestions(suggestionName);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		e.preventDefault();
		setSearchValue(e.target.value);
		generateSuggestions(e.target.value);
	};

	const handleSelectChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		if (name === 'term' || name === 'year') {
			$selectedTermYear.setKey(name as keyof AcademicYearOptions, value);
			$storedCourses.set([]);
		}
	};

	const generateSuggestions = async (search_prefix: string) => {
		const requestBody = {
			prefix: search_prefix,
			term: academicTermYear.term,
			year: +academicTermYear.year,
		};

		try {
			const response = await fetch(`${API_URL}/schedules/filter/prefix`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
                credentials: 'include',
			});

			if (!response.ok) {
				throw new Error(`Validation request failed: ${response.statusText}`);
			}

			const data = await response.json();
			onSuggestionsUpdate(data);
			setSuggestions(data);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		}
	};

	useEffect(() => {
		generateSuggestions(searchValue);
	}, [academicTermYear]);

	return (
		<form className="mt-4 mx-4" ref={searchRef} onSubmit={handleSubmit}>
			<div className="flex m-4">
				<div className="relative w-full">
					<label
						htmlFor="default-search"
						className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
					>
						Search
					</label>
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<svg
							className="w-4 h-4 text-gray-500 dark:text-gray-400"
							aria-hidden="true"
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
					</div>
					<input
						ref={searchInputRef}
						type="search"
						id="default-search"
						className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-l-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Search schedules' name or course code..."
						value={searchValue}
						onChange={(e) => handleSearchChange(e)}
						required
						onFocus={() => setIsActive(true)}
						autoComplete="off"
					/>
					<button
						type="submit"
						className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>
						Search
					</button>
					{/* Dropdown Suggestions */}
					{isActive && (
						<div className="absolute w-full mt-2 ml-2 mr-2 border border-gray-300 rounded-lg bg-white shadow-lg z-10 bg-opacity-95 dark:bg-gray-800">
							{suggestions.map((schedule, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-2 hover:bg-gray-200 cursor-pointer bg-opacity-80 dark:hover:bg-gray-700 dark:text-white"
								>
									<button
										className="flex-grow flex items-center justify-start focus:outline-none"
										onClick={(e) => handleSuggestionSearch(e, schedule.name)}
									>
										<span className="font-bold">{schedule.name}</span>
									</button>

									{/* Arrow icon */}
									<button
										className="ml-2 mr-2 p-1 hover:bg-gray-300 dark:hover:bg-gray-900 rounded-lg transition duration-150 ease-in-out"
										onClick={(e) => handleSuggestionFill(e, schedule.name)}
									>
										↖
									</button>
								</div>
							))}
						</div>
					)}
				</div>
				<div>
					<select
						id="term"
						name="term"
						className="h-full bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-32 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						value={academicTermYear.term}
						onChange={handleSelectChange}
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
						className="h-full rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm	 focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-32 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						value={academicTermYear.year}
						onChange={handleSelectChange}
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
			</div>
		</form>
	);
};

export default SearchBar;
