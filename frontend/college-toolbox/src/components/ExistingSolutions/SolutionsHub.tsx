import React, { useState, useEffect  } from 'react';
import SearchBar from './SearchBar'; 
import Filters from './Filters'
import SolutionsView from './SolutionsView';
import { API_URL } from '../../app/constants';
import type { ResourcesModel } from '../../types/entities';

const SolutionsHub: React.FC = () => {
    const [applications, setApplications] = useState<ResourcesModel[]>([]);

    const handleSearchResources = async (value: string) => {
        try {
            if (value !== "") {
                const requestBody = {
                    prefix: value
                };
            
                const response = await fetch(`${API_URL}/existing-solutions/filter/prefix`, {
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

    const handleFilterResources = async (filters :{ [key: string]: string[] }) => {
        try {
            const requestBody = {
                type : filters.type,
                sort : filters.sort,
                cost : filters.cost,
            };
        
            const response = await fetch(`${API_URL}/existing-solutions/filter/applyAll`, {
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
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    useEffect(() => {
        handleFilterResources({type : [], sort : [], cost : []});
    }, []);

    return (
        <div className="solutions-hub-container">
            <SearchBar onSearch={handleSearchResources} />
            <div className="grid grid-cols-5 gap-4 mx-4 mt-4">
                <div className="col-span-1 ">
                    <div className="filters-container">
                        <Filters onFiltered={handleFilterResources}/>
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
