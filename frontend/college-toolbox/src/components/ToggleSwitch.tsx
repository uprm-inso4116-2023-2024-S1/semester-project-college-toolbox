import React from 'react';

interface Props {
	id: string;
	checked?: boolean;
	className?: string;
	onChange: (a: any) => void;
}

const ToggleSwitch = ({
	id,
	checked = false,
	className,
	onChange,
}: Props) => {
	return (
		<label
			htmlFor={id}
			className={`relative w-11 h-6 cursor-pointer ${className}`} // Use template literals for className
		>
			<input
				type="checkbox"
				id={id}
				className="sr-only peer"
				checked={checked}	
				onChange={onChange}
			/>
			<div className="w-full h-full bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 border-black"></div>
		</label>
	);
};

export default ToggleSwitch;
