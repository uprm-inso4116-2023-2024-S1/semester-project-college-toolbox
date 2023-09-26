import React, { useState } from 'react';
import { url, asset } from '../lib/data';
import { register } from '../services/authentication';

const SignUpForm = () => {
	const [formData, setFormData] = useState({
		firstName: '',
		initial: '',
		firstLastName: '',
		secondLastName: '',
		profileImageUrl: '',
		email: '',
		password: '',
	});

	const handleInputChange = (event) => {
		const { name, value, type, checked } = event.target;
		const newValue = type === 'checkbox' ? checked : value;

		setFormData({
			...formData,
			[name]: newValue,
		});
	};

	const handleFormSubmit = async (event) => {
		event.preventDefault();

		// Call the register function with form data
		try {
			const user = await register(formData);
			if (user) {
				// Registration was successful, navigate to the home page
				window.location.href = url('');
			} else {
				// Handle registration failure (e.g., show an error message)
				console.error('Registration failed');
			}
		} catch (error) {
			console.error('Error during registration:', error);
		}
	};

	return (
		<div className="w-full flex flex-col items-center justify-center px-6 pt-8 mx-auto pt:mt-0 dark:bg-gray-900">
			<a
				href="#"
				className="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white"
			>
				<img
					src={asset('docs/assets/toolboxImg.svg')}
					alt="toolbox logo"
					className="mr-4 h-11"
				/>
				<span>College Toolbox</span>
			</a>
			<div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
					Create a Free Account
				</h2>
				<form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
					{/* Form fields with controlled components */}
					{/* First Name */}
					<div className="flex space-x-4">
						<div className="w-1/2">
							<label
								htmlFor="firstName"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								First Name <span className="text-red-600">*</span>
							</label>
							<input
								type="text"
								name="firstName"
								id="firstName"
								className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								placeholder="John"
								required
								value={formData.firstName}
								onChange={handleInputChange}
							/>
						</div>
						{/* Middle Name Initial */}
						<div className="w-1/2">
							<label
								htmlFor="initial"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								Middle Name Initial
							</label>
							<input
								type="text"
								name="initial"
								id="initial"
								className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								placeholder="M"
								value={formData.initial}
								onChange={handleInputChange}
							/>
						</div>
					</div>

					<div className="flex space-x-4">
						<div className="w-1/2">
							<label
								htmlFor="firstLastName"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								First Last Name <span className="text-red-600">*</span>
							</label>
							<input
								type="text"
								name="firstLastName"
								id="firstLastName"
								className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								placeholder="Doe"
								value={formData.firstLastName}
								onChange={handleInputChange}
								required
							/>
						</div>
						<div className="w-1/2">
							<label
								htmlFor="secondLastName"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								Second Last Name
							</label>
							<input
								type="text"
								name="secondLastName"
								id="secondLastName"
								className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								placeholder="Smith"
								value={formData.secondLastName}
								onChange={handleInputChange}
							/>
						</div>
					</div>
					<div>
						<label
							htmlFor="profileImageUrl"
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>
							Profile Image URL
						</label>
						<input
							type="url"
							name="profileImageUrl"
							id="profileImageUrl"
							className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							placeholder=""
							value={formData.profileImageUrl}
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<label
							htmlFor="email"
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>
							Email <span className="text-red-600">*</span>
						</label>
						<input
							type="email"
							name="email"
							id="email"
							className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							placeholder="name@company.com"
							value={formData.email}
							onChange={handleInputChange}
							required
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>
							Password <span className="text-red-600">*</span>
						</label>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="••••••••"
							className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							required
							value={formData.password}
							onChange={handleInputChange}
						/>
					</div>
					{/* Submit Button */}
					<button
						type="submit"
						className="w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
					>
						Create account
					</button>
					<div className="text-sm font-medium text-gray-500 dark:text-gray-400">
						Already have an account?{' '}
						<a
							href={url('authentication/sign-in')}
							className="text-primary-700 hover:underline dark:text-primary-500"
						>
							Login here
						</a>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUpForm;
