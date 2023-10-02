import React, { useState } from 'react';
import { url, asset } from '../lib/data';
import { login } from '../services/authentication';

const LoginForm = () => {
	const [formData, setFormData] = useState({
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

		// Call the login function with form data
		try {
			const user = await login(formData.email, formData.password);
			if (user) {
				// Login was successful, navigate to the home page
				window.location.href = url('');
			} else {
				// Handle login failure (e.g., show an error message)
				console.error('Login failed');
			}
		} catch (error) {
			console.error('Error during login:', error);
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
			{/* Card */}
			<div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
					Sign in to platform
				</h2>
				<form className="mt-8 space-y-6" action="#" onSubmit={handleFormSubmit}>
					<div>
						<label
							htmlFor="email"
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>
							Your email
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
							Your password
						</label>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="••••••••"
							className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
							value={formData.password}
							onChange={handleInputChange}
							required
						/>
					</div>
					<div className="flex items-start flex-wrap">
						<a
							href="#"
							className="ml-auto mt-4 text-left text-sm text-primary-700 hover:underline dark:text-primary-500 w-full"
						>
							Lost Password?
						</a>
					</div>
					<button
						type="submit"
						className="w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
					>
						Login to your account
					</button>
					<div className="text-sm font-medium text-gray-500 dark:text-gray-400">
						Not registered?
						<a
							href={url('authentication/sign-up')}
							className="text-primary-700 hover:underline dark:text-primary-500"
						>
							Create account
						</a>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginForm;
