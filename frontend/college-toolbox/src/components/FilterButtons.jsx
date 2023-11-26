// FilterButtons.js
import React from 'react';

const FilterButtons = ({
	handleFilterAll,
	handleFilterAccepted,
	handleFilterDenied,
	handleFilterWaiting,
	selectedStatusFilter,
}) => (
	<div className="filter-buttons">
		<button
			className={`filter-button ${
				selectedStatusFilter === 'All' ? 'active' : ''
			}`}
			onClick={handleFilterAll}
		>
			All
		</button>
		<button
			className={`filter-button ${
				selectedStatusFilter === 'Accepted' ? 'active' : ''
			}`}
			onClick={handleFilterAccepted}
		>
			Accepted
		</button>
		<button
			className={`filter-button ${
				selectedStatusFilter === 'Denied' ? 'active' : ''
			}`}
			onClick={handleFilterDenied}
		>
			Denied
		</button>
		<button
			className={`filter-button ${
				selectedStatusFilter === 'Waiting' ? 'active' : ''
			}`}
			onClick={handleFilterWaiting}
		>
			Waiting
		</button>
	</div>
);

export default FilterButtons;
