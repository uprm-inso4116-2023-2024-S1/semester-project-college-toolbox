import React, { useState } from 'react';
import { API_URL } from '../../app/constants';

const Filters: React.FC<{ applications: any[] }> = ({ applications }) => {
	const [filterList, setCheckedFilters] = useState<string[]>([]);

	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (event.target.checked) {
			// Checkbox was checked, add its value to the array
			setCheckedFilters((prevChecked) => [...prevChecked, value]);
		} else {
			// Checkbox was unchecked, remove its value from the array
			setCheckedFilters((prevChecked) => prevChecked.filter((item) => item !== value));
		}
	};
	
	const mapFiltersToApps = () => {
		let filteredApplications = applications.map(app => {
			for(let filter in filterList){
				if(app.Type == filter){
					return app;
				}
			}
		});
		return filteredApplications;
	};

	const handleSubmitEvent = () => {
		applications = mapFiltersToApps();
		//Uncheck the boxes and clear the list
		for(let filterString in filterList){
			const checkbox = document.getElementById(filterString) as HTMLInputElement;
			if(checkbox!==null) {
				checkbox.checked = false;
			} else {
				console.error("Input element with id "+ filterString + " was not found.");
			}	
		setCheckedFilters([]);
		}
	}


    return (
        <div className="bg-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Filters</h2>
             {/* Filter type */}
						 <div id="type" className="border-black border p-2">
							<h3 className="text-xl font-medium mb-2">Type:</h3>
							{/* sub elements */}
							<div className="p-4">
								<label htmlFor="Note-taking" className="flex items-center">
									<input type="checkbox" id="Note-taking" value="Note-taking" onChange={handleCheckboxChange} checked={filterList.includes('Note-taking')}  className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Note-taking</span>
								</label>

								<label htmlFor="Organizational" className="flex items-center mt-2">
									<input type="checkbox" id="Organizational" value="Organizational" onChange={handleCheckboxChange} checked={filterList.includes('Organizational')} className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Organizational</span>
								</label>

								<label htmlFor="Study" className="flex items-center mt-2">
									<input type="checkbox" id="Study" value="Study" onChange={handleCheckboxChange} checked={filterList.includes('Study')} className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Study</span>
								</label>

								<label htmlFor="Information" className="flex items-center">
									<input type="checkbox" id="Information" value="Information" onChange={handleCheckboxChange} checked={filterList.includes('Information')} className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Information</span>
								</label> 	

								<label htmlFor="Proofreading" className="flex items-center mt-2">
									<input type="checkbox" id="Proofreading" value="Proofreading" onChange={handleCheckboxChange} checked={filterList.includes('Proofreading')} className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Proofreading</span>
								</label>

								<label htmlFor="Budgetting" className="flex items-center">
									<input type="checkbox" id="Budgetting" value="Budgetting" onChange={handleCheckboxChange} checked={filterList.includes('Budgetting')} className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Budgetting</span>
								</label> 

								<label htmlFor="Other" className="flex items-center mt-2">
									<input type="checkbox" id="Other" value="Other" onChange={handleCheckboxChange} checked={filterList.includes('Other')} className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Other</span>
								</label>
								
							</div>
						 </div>

						 {/* Filter type */}
						 <div id="sort" className="border-black border p-2">
							<h3 className="text-xl font-medium mb-2">Sort by:</h3>
							<h3 className="text-l font-medium mb-2">Ascending / Descending</h3>
							{/* sub elements */}
							<div className="p-4">
								<label htmlFor="A-Z" className="flex items-center">
									<input type="checkbox" id="A-Z" value="A-Z" onChange={handleCheckboxChange} checked={filterList.includes('A-Z')} className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">A-Z<span>&uarr;</span></span>
								</label> 	

								<label htmlFor="Price" className="flex items-center mt-2">
									<input type="checkbox" id="Price" value="Price" onChange={handleCheckboxChange} checked={filterList.includes('Price')} className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Price<span>&darr;</span></span>
								</label>
							</div>
						 </div>

						 {/* Filter type */}
						 <div id="cost" className="border-black border p-2">
							<h3 className="text-xl font-medium mb-2">Cost</h3>
							{/* sub elements */}
							<div className="p-4">
								<label htmlFor="Free" className="flex items-center">
									<input type="checkbox" id="Free" value="Free" onChange={handleCheckboxChange} checked={filterList.includes('Free')} className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Free</span>
								</label> 

								<label htmlFor="One-Time Buy" className="flex items-center">
									<input type="checkbox" id="One-Time Buy" value="One-Time Buy" onChange={handleCheckboxChange} checked={filterList.includes('One-Time Buy')} className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">One-Time Buy</span>
								</label> 

								<label htmlFor="Subscription" className="flex items-center">
									<input type="checkbox" id="Subscription" value="Subscription" onChange={handleCheckboxChange} checked={filterList.includes('Subscription')} className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Subscription</span>
								</label> 									
							</div>
						</div>

						<button type="button" onClick={handleSubmitEvent} className="text-white mt-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Apply</button>
        </div>
    );
}

export default Filters;
