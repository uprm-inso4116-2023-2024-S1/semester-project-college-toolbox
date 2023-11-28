import React, { useState, useRef, useEffect} from 'react';
import { API_URL } from '../../app/constants';
import type { ResourcesModel } from '../../types/entities';

const SearchBar: React.FC<{ onSearch: (value: string) => void }> = ({ onSearch }) => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [suggestions, setSuggestions] = useState<ResourcesModel[]>([]);
    const searchRef = useRef<HTMLFormElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchValue, setSearchValue] = useState<string>('');

    const resetSearchBar = () => {
        setIsActive(false);
        setSearchValue('');
        setSuggestions([]);
        searchInputRef.current?.blur(); 
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        resetSearchBar();
        onSearch(searchValue);
    };

    const handleSuggestionSearch = (e: React.FormEvent, suggestion_value : string) => {
        e.preventDefault();
        resetSearchBar();
        onSearch(suggestion_value);
    };

    // click handler to check if click is outside the search component
    const handleClickOutside = (event: globalThis.MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
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

    const handleSuggestionFill = (e: React.MouseEvent<HTMLButtonElement>, suggestionName: string): void => {
        e.preventDefault();
        setSearchValue(suggestionName);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault();
        setSearchValue(e.target.value)
    };

    const generateSuggestions = async (search_prefix: string) => {
        const requestBody = {
            prefix: search_prefix
        };

        try {
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
            setSuggestions(data);
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        }
    };


    useEffect(() => {
        if (searchValue !== "") {
            generateSuggestions(searchValue);
        } else {
            setSuggestions([]);
        }
    }, [searchValue]);
    

    return (
        <form className='mt-4 mx-4' ref={searchRef} onSubmit={handleSubmit}>
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input
                    ref={searchInputRef}
                    type="search"
                    id="default-search"
                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search resources..."
                    value={searchValue}
                    onChange={(e) => handleSearchChange(e)}
                    required
                    onFocus={() => setIsActive(true)}
                    autoComplete="off"
                />
                <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                
                {/* Dropdown Suggestions */}
                {isActive && (
                    <div className="absolute w-full mt-2 ml-2 mr-2 border border-gray-300 rounded-lg bg-white shadow-lg z-10 bg-opacity-95 dark:bg-gray-800">
                        {suggestions.map((app, index) => (
                            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-200 cursor-pointer bg-opacity-80 dark:hover:bg-gray-700 dark:text-white">
                                <button 
                                    className="flex-grow flex items-center justify-start focus:outline-none"
                                    onClick={(e) => handleSuggestionSearch(e, app.Name)}
                                >
                                    <div className="w-8 h-8 mr-2"> 
                                        <img 
                                            src={app.Icon} 
                                            alt={app.Name + " logo"} 
                                            className="w-8 h-8 object-cover rounded" 
                                        />
                                    </div>
                                    <span className="font-bold">{app.Name}</span>
                                </button>
                                
                                {/* Arrow icon */}
                                <button 
                                    className="ml-2 mr-2 p-1 hover:bg-gray-300 dark:hover:bg-gray-900 rounded-lg transition duration-150 ease-in-out"
                                    onClick={(e) => handleSuggestionFill(e, app.Name)}
                                >
                                    ↖
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </form>
    );
}

export default SearchBar;
