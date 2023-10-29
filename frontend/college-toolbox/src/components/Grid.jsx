// Import React and any other necessary dependencies
import React from 'react';

function CreateItem({imgLink, appLink, name, description}) {
	// Function to build an item
	const buildItem = () => {
		const mainGrid = document.getElementById('mainGrid');


		// li element
		const item = document.createElement('li');
		item.id = name;
		item.classList.add(
			"bg-white",
			"rounded-lg",
			"shadow-lg", 
			"overflow-hidden"
		);


		// img element
		const imgElement = document.createElement('img');
		imgElement.src = imgLink;
		imgElement.alt = "Image of the app";
		imgElement.classList.add("w-72", "h-auto", "object-cover", "aspect-auto", "mx-auto", "items-center");


		// div element
		const divElement = document.createElement('div');
		//divElement.classList.add("p-4");


		// elements that go inside the div
		const h2Element = document.createElement('h2');
		h2Element.textContent = name;
		h2Element.classList.add("text-xl", "font-semibold");

		const pElement = document.createElement('p');
		pElement.textContent = description;
		pElement.classList.add("text-gray-600")

		const buttonElement = document.createElement('a')
		buttonElement.href = appLink;
		buttonElement.textContent = "Go to the app's page";
		buttonElement.classList.add(
			"bottom-0",
			"mt-4",
			"flex",
			"items-center",
			"py-2",
			"px-4",
			"rounded-full",
			"text-white", 
			"bg-blue-700", 
			"hover:bg-blue-800"
		)


		divElement.appendChild(h2Element);
		divElement.appendChild(pElement);
		divElement.appendChild(buttonElement);

		item.appendChild(imgElement);
		item.appendChild(divElement);

		mainGrid.appendChild(item);
	};

    // Call the createFilterOptions function when the component mounts
		React.useEffect(() => {
				buildItem();
		}, []);

		// Return any JSX or component content here
    return (
		// JSX content here
		<div class="container mx-auto py-8">
  	<ul id='mainGrid' class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  	  {/* <!-- Catalog items will go here --> */}
 	  </ul>
		</div>	
	);
}

export default CreateItem;
