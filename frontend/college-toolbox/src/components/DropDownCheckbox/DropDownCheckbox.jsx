// Import React and any other necessary dependencies
import React from 'react';

// Define a functional component that includes the createFilterOptions function
function FilterOptions({filterType, targetId, data, dataId}) {
    // Function to create filter options
    const createFilterOptions = () => {
        const filterContainer = document.getElementById(targetId);
				      // Loop through each filter option and create <li> elements
        data.forEach((filter) => {
            // li element
            const filterItem = document.createElement('li');

            // div element
            const divElement = document.createElement('div');
            divElement.classList.add(
                "flex",
                "items-center",
                "p-2",
                "rounded",
                "hover:bg-gray-100",
                "dark:hover:bg-gray-600"
            );

            // input element
            const inputElement = document.createElement('input');
            inputElement.type = 'checkbox';
            inputElement.classList.add(
                "w-4",
                "h-4",
                "text-blue-600",
                "bg-gray-100",
                "border-gray-300",
                "rounded",
                "focus:ring-blue-500",
                "dark:focus:ring-blue-600",
                "dark:ring-offset-gray-700",
                "dark:focus:ring-offset-gray-700",
                "focus:ring-2",
                "dark:bg-gray-600",
                "dark:border-gray-500"
            );

            // label element
            const labelElement = document.createElement('label');
            labelElement.textContent = filter;
            labelElement.classList.add(
                "w-full",
                "ml-2",
                "text-sm",
                "font-medium",
                "text-gray-900",
                "rounded",
                "dark:text-gray-300"
            );

            divElement.appendChild(inputElement);
            divElement.appendChild(labelElement);

            filterItem.appendChild(divElement);

            filterContainer.appendChild(filterItem);
        });
    };

    // Call the createFilterOptions function when the component mounts
    React.useEffect(() => {
        createFilterOptions();
    }, []);

    // Return any JSX or component content here
    return (
        // JSX content here
			<div id="dropdownMain">
				<button id="dropdownBgHoverButton" data-dropdown-toggle={dataId} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
					{filterType} 
					<svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
					</svg>
				</button>

        <div id={dataId} class="z-10 hidden w-48 bg-white rounded-lg shadow dark:bg-gray-700">
            <ul id={targetId} class="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownBgHoverButton">
                {/* Content will be generated here */}
            </ul>
        </div>
			</div>
    );
}

export default FilterOptions;
