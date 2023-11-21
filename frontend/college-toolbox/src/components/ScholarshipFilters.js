import React, { useState, useEffect } from 'react';

const useFilterFactory = (initialData) => {
	const createFilter = () => {
		const [filteredData, setFilteredData] = useState(initialData);

		const applyFilters = (filters) => {
			const filteredResult = initialData.filter(filters);
			setFilteredData(filteredResult);
		};

		useEffect(() => {
			applyFilters(() => true); // Initial rendering without any filters
		}, [initialData]);

		return [filteredData, applyFilters];
	};

	return createFilter;
};

export default useFilterFactory;
