import React from 'react';
import SearchBar from './SearchBar'; 
import Filters from './Filters'
import SolutionsView from './SolutionsView'



const SolutionsHub: React.FC = () => {
    return (
        <div className="solutions-hub-container">
            <SearchBar />
            <div className="grid grid-cols-5 gap-4 mx-4 mt-4">
                <div className="col-span-1">
                    <Filters />
                </div>
                <div className="col-span-4">
                    <SolutionsView />
                </div>
            </div>

        </div>
    );
}

export default SolutionsHub;
