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
						 <div className="border-black border p-2">
							<h3 className="text-xl font-medium mb-2">Filter title</h3>
							{/* sub elements */}
							<div className="p-4">
								<label htmlFor="checkbox1" className="flex items-center">
									<input type="checkbox" id="checkbox1" name="checkbox1" className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Checkbox 1</span>
								</label>

								<label htmlFor="checkbox2" className="flex items-center mt-2">
									<input type="checkbox" id="checkbox2" name="checkbox2" className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Checkbox 2</span>
								</label>
							</div>
						 </div>

						 {/* Filter type */}
						 <div className="border-black border p-2">
							<h3 className="text-xl font-medium mb-2">Filter title</h3>
							{/* sub elements */}
							<div className="p-4">
								<label htmlFor="checkbox1" className="flex items-center">
									<input type="checkbox" id="checkbox1" name="checkbox1" className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Checkbox 1</span>
								</label>

								<label htmlFor="checkbox2" className="flex items-center mt-2">
									<input type="checkbox" id="checkbox2" name="checkbox2" className="form-checkbox text-bg-blue-700 h-5 w-5"/>
									<span className="ml-2">Checkbox 2</span>
								</label>
							</div>
						 </div>
						<button type="submit" className="text-white mt-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Apply</button>
        </div>
    );
}

export default Filters;
