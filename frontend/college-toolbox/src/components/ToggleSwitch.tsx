import React from 'react';

interface Props {
	id: string;
	checked?: boolean;
	className?: string; // Change 'class' to 'className' to match JSX syntax
}

const ToggleSwitch = ({ id, checked = false, className, onChange }) => {
	return (
		<label
			htmlFor={id}
			className={`relative flex items-center cursor-pointer ${className}`} // Use template literals for className
		>
			<input
				type="checkbox"
				id={id}
				className="sr-only"
				checked={checked}
				onChange={onChange}
			/>{' '}
			{/* Use 'checked' prop */}
			<span
				className={`bg-gray-200 dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-6 rounded-full w-11 toggle-bg border`}
			></span>
		</label>
	);
};

export default ToggleSwitch;
