import React, { useState, useEffect  } from 'react';
import SearchBar from './SearchBar'; 
import Filters from './Filters'
import SolutionsView from './SolutionsView';
import { API_URL } from '../../app/constants';

const SolutionsHub: React.FC = () => {
    const [applications, setApplications] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState<string>(""); // New state for search value

    const displayAllApplications = async () => {
        try {
            const response = await fetch(`${API_URL}/ExistingApplication/get/all`);
            if (response.ok) {
                const data: any[] = await response.json();
                setApplications(data); // Set the applications state with the fetched data
            } else {
                console.error("Error fetching applications:", await response.text());
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error fetching applications:", error.message);
            }
        }
    };

    const handleSearchResources = async (value: string) => {
        setSearchValue(value);
        try {
            if (value !== "") {
                const requestBody = {
                    prefix: value
                };
            
                const response = await fetch(`${API_URL}/ExistingApplication/filter/prefix`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });
            
                if (!response.ok) {
                    throw new Error(`Validation request failed: ${response.statusText}`);
                }
            
                const data = await response.json();
                setApplications(data);
            }
            else {
                setApplications([]);
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };


    useEffect(() => {
        displayAllApplications();
    }, []);

    return (
        <div className="solutions-hub-container">
            <SearchBar onSearch={handleSearchResources} />
            <div className="grid grid-cols-5 gap-4 mx-4 mt-4">
                <div className="col-span-1 ">
                    <div className="filters-container">
                        <Filters />
                    </div>
                </div>
                <div className="col-span-4">
                    <SolutionsView applications={applications} />
                </div>
            </div>
        </div>
    );
}

export default SolutionsHub;
