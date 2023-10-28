import React, { useState } from 'react';
import SearchBar from './SearchBar'; 
import Filters from './Filters'
import SolutionsView from './SolutionsView';
import { API_URL } from '../../app/constants';

const SolutionsHub: React.FC = () => {
    const [applications, setApplications] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState<string>(""); // New state for search value

    const handleSearchResources = async (value: string) => {
        setSearchValue(value);
        try {
            const response = await fetch(`${API_URL}/ExistingApplication/get/all`);
            if (response.ok) {
                const data = await response.json();
                setApplications(data);
            } else {
                console.error("Error fetching applications:", await response.text());
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    return (
        <div className="solutions-hub-container">
            <SearchBar onSearch={handleSearchResources} />
            <div className="grid grid-cols-5 gap-4 mx-4 mt-4">
                <div className="col-span-1 ">
									<div className="filters-container fixed">
                    <Filters applications={applications}/>
									</div>
                </div>
                <div className="col-span-4">
                    <SolutionsView applications={applications} />
                    <p>Submitted search string: {searchValue}</p> {/* Display the submitted search string */}
                </div>
            </div>
        </div>
    );
}

export default SolutionsHub;
