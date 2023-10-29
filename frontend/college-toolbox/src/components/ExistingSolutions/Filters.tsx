import React, { useState } from 'react';
import { API_URL } from '../../app/constants';

const Filters: React.FC = () => {
	const [filterList, setCheckedFilters] = useState<string[]>([]);

	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (event.target.checked) {
			// For mutually exclusive checkboxes
			if (value === 'Price' || value === 'A-Z') {
				setCheckedFilters((prevChecked) => prevChecked.filter((item) => item !== 'Price' && item !== 'A-Z'));
			}

            if (value === 'Free' || value === 'One-Time Buy' || value === 'Subscription') {
				setCheckedFilters((prevChecked) => prevChecked.filter((item) => item !== 'Free' && item !== 'One-Time Buy' && item !== 'Subscription'));
			}

			// Checkbox was checked, add its value to the array
			setCheckedFilters((prevChecked) => [...prevChecked, value]);
		} else {
			// Checkbox was unchecked, remove its value from the array
			setCheckedFilters((prevChecked) => prevChecked.filter((item) => item !== value));
		}
	};

	const handleSubmitEvent = () => {
		//Uncheck the boxes and clear the list

		
	};


    return (
        <div className="bg-gray-200 rounded-lg p-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <h2 className="text-2xl font-extrabold mb-2">Filters</h2>
            <div className="h-132 overflow-y-auto">

                {/* Filter type */}
                <div id="type" className="border-gray-300 border-2 p-2 dark:border-gray-600">
                    <h3 className="text-xl font-medium">Type:</h3>
                    <div className="p-2">
                        {['Note-taking', 'Organizational', 'Study', 'Information', 'Proofreading', 'Budgetting'].map((filterType) => (
                            <label htmlFor={filterType} className="flex items-center mt-1 font-medium hover:font-extrabold" key={filterType}>
                                <input type="checkbox" id={filterType} value={filterType} onChange={handleCheckboxChange} checked={filterList.includes(filterType)} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-500"/>
                                <span className="ml-2 text-m text-gray-900 dark:text-gray-300">{filterType}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Filter sort */}
                <div id="sort" className="border-gray-300 border-2 p-2 dark:border-gray-600">
                    <h3 className="text-xl font-medium">Sort by:</h3>
                    <div className="p-2">
                        <label htmlFor="High to low" className="flex items-center mt-1 font-medium hover:font-extrabold">
                            <input type="checkbox" id="High to low" value= "High to low" onChange={handleCheckboxChange} checked={filterList.includes("High to low")} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-500"/>
                            <span className="ml-2 text-m text-gray-900 dark:text-gray-300">High to low</span>
                        </label>

                        {['A-Z', 'Price'].map((sortOption) => (
                            <label htmlFor={sortOption} className="flex items-center mt-1 font-medium hover:font-extrabold" key={sortOption}>
                                <input type="checkbox" id={sortOption} value={sortOption} onChange={handleCheckboxChange} checked={filterList.includes(sortOption)} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-500"/>
                                <span className="ml-2 text-m text-gray-900 dark:text-gray-300">{sortOption}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Filter cost */}
                <div id="cost" className="border-gray-300 border-2 p-2 dark:border-gray-600">
                    <h3 className="text-xl font-medium">Cost:</h3>
                    <div className="p-2">
                        {['Free', 'One-Time Buy', 'Subscription'].map((costOption) => (
                            <label htmlFor={costOption} className="flex items-center mt-1 font-medium hover:font-extrabold" key={costOption}>
                                <input type="checkbox" id={costOption} value={costOption} onChange={handleCheckboxChange} checked={filterList.includes(costOption)} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-500"/>
                                <span className="ml-2 text-m text-gray-900 dark:text-gray-300">{costOption}</span>
                            </label>
                        
                        ))}
                    </div>
                </div>
            </div>
            <button type="button" onClick={handleSubmitEvent} className="text-white mt-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Apply</button>
            <button type="button" onClick={() => { setCheckedFilters([]); }} className="text-white mt-3 ml-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Clear</button>
        </div>
    );
}

export default Filters;
