import React from 'react';
import { API_URL } from '../../app/constants';

const Filters: React.FC = () => {
		const createFilterToAppMap = async () => {
			let data = [];
			try{
				const response = await fetch(`${API_URL}/ExistingApplication/get/all`);
				if (response.ok) {
					data = await response.json();
					//how do I want to map our options to the filters
					data.map
				}
			}catch (error) {
				console.error("Error fetching applications:", error);
			}
		};






    return (
        <div className="bg-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Filters</h2>
             {/* Filter type */}
						 <div id="type" className="border-black border p-2">
							<h3 className="text-xl font-medium mb-2">Type:</h3>
							{/* sub elements */}
							<div className="p-4">
								<label htmlFor="Note-taking" className="flex items-center">
									<input type="checkbox" id="Note-taking" name="Note-taking" className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Note-taking</span>
								</label>

								<label htmlFor="Organizational" className="flex items-center mt-2">
									<input type="checkbox" id="Organizational" name="Organizational" className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Organizational</span>
								</label>

								<label htmlFor="Study" className="flex items-center mt-2">
									<input type="checkbox" id="Study" name="Study" className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Study</span>
								</label>

								<label htmlFor="ChatGPT" className="flex items-center">
									<input type="checkbox" id="ChatGPT" name="ChatGPT" className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">ChatGPT</span>
								</label> 	

								<label htmlFor="Proofreading" className="flex items-center mt-2">
									<input type="checkbox" id="Proofreading" name="Proofreading" className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Proofreading</span>
								</label>

								<label htmlFor="Budgetting" className="flex items-center">
									<input type="checkbox" id="Budgetting" name="Budgetting" className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Budgetting</span>
								</label> 

								<label htmlFor="Other" className="flex items-center mt-2">
									<input type="checkbox" id="Other" name="Other" className="form-checkbox text-bg-blue-700 h-5 w-5"/>
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
									<input type="checkbox" id="A-Z" name="A-Z" className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">A-Z<span>&uarr;</span></span>
								</label> 	

								<label htmlFor="Price" className="flex items-center mt-2">
									<input type="checkbox" id="Price" name="Price" className="form-checkbox text-bg-blue-700 h-5 w-5"/>
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
									<input type="checkbox" id="Free" name="Free" className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Free</span>
								</label> 

								<label htmlFor="One-Time Buy" className="flex items-center">
									<input type="checkbox" id="One-Time Buy" name="One-Time Buy" className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">One-Time Buy</span>
								</label> 

								<label htmlFor="Subscription" className="flex items-center">
									<input type="checkbox" id="Subscription" name="Subscription" className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Subscription</span>
								</label> 									
							</div>
						</div>

						<button type="submit" className="text-white mt-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Apply</button>
        </div>
    );
}

export default Filters;
