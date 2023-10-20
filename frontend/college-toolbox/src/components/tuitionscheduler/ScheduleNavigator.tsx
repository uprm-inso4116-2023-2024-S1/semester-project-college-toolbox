import React, { FC } from 'react';

interface ScheduleNavigatorProps {
	setState: React.Dispatch<React.SetStateAction<number>>;
	currentState: number;
	totalItems: number;
}

const ScheduleNavigator: FC<ScheduleNavigatorProps> = ({
	setState,
	currentState,
	totalItems,
}) => {
	const handleDecrement = () => {
		setState((prev) => (prev > 0 ? prev - 1 : prev));
	};

	const handleIncrement = () => {
		setState((prev) => (prev + 1 < totalItems ? prev + 1 : prev));
	};

	return (
		<div className="w-full text-center">
			<button
				className="px-4 py-2 bg-blue-500 text-white rounded"
				onClick={handleDecrement}
				disabled={currentState <= 0}
			>
				&lt;
			</button>
			<span className="mx-4 dark:text-white">{`${currentState + 1}/${totalItems}`}</span>
			<button
				className="px-4 py-2 bg-blue-500 text-white rounded"
				onClick={handleIncrement}
				disabled={currentState >= totalItems - 1}
			>
				&gt;
			</button>
		</div>
	);
};

export default ScheduleNavigator;
