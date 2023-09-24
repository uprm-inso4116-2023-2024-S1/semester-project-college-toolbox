import React, {useState, useEffect} from 'react'; // Import React if it's not already imported
import ToggleSwitch from './ToggleSwitch.jsx';
import { asset, url } from '../lib/data.js';
import { storedProfile, isLoggedIn } from '../lib/profile';
import { useStore } from '@nanostores/react';


const UserSettings = () => {
	const $storedProfile = useStore(storedProfile);
	const [hasCourseNotifications, setCourseNotifications] = useState(false)
	const [profileForm, setProfileForm] = useState({
    firstName: storedProfile.get().firstName,
    middleInitial: storedProfile.get().initial,
    firstLastName: storedProfile.get().firstLastName,
    secondLastName: storedProfile.get().secondLastName,
		profileImageUrl: storedProfile.get().profileImageUrl,
    email: storedProfile.get().email,
  });
	const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
		newPassword: '',
		confirmPassword: '',
  });

	const toggleCourseNotifications = () => {
    setCourseNotifications(!hasCourseNotifications)
	}
	
	useEffect(() => {
		if (isLoggedIn.get()){
			setProfileForm(
			{	firstName: $storedProfile.firstName,
				middleInitial: $storedProfile.initial,
				firstLastName: $storedProfile.firstLastName,
				secondLastName: $storedProfile.secondLastName,
				profileImageUrl: $storedProfile.profileImageUrl,
				email: $storedProfile.email
			}
			)
		}
		
	},[$storedProfile])

	const handleProfileInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;

    setProfileForm({
      ...profileForm,
      [name]: newValue,
    });
  };

	const handleProfileSave = () => {
    //TODO: emit update profile request
  };


	const handlePasswordInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;

    setPasswordForm({
      ...passwordForm,
      [name]: newValue,
    });
  };

	const handlePasswordSave = () => {
    //TODO: emit update password
  };

  return (
		<>
		 <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
      <div className="mb-4 col-span-full xl:mb-2">
        <nav className="flex mb-5" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2">
            <li className="inline-flex items-center">
              <a
                href={url('')}
                className="inline-flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white"
              >
                <svg
                  className="w-5 h-5 mr-2.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                  ></path>
                </svg>
                Home
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="ml-1 text-gray-400 md:ml-2 dark:text-gray-500" aria-current="page">
                  Settings
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          User settings
        </h1>
      </div>
      <div className="col-span-2">
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-semibold dark:text-white">General information</h3>
					<form onSubmit={handleProfileSave}>
						<div className="grid grid-cols-6 gap-6">
							<div className="col-span-8 sm:col-span-4">
								<label
									htmlFor="first-name"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									First Name
								</label>
								<input
									type="text"
									name="firstName"
									id="firstName"
									className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									placeholder=""
									value={profileForm.firstName}
									onChange={handleProfileInputChange}
									required
								/>
							</div>
							<div className="col-span-4 sm:col-span-2">
								<label
									htmlFor="middleInitial"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Middle Initial
								</label>
								<input
									type="text"
									name="middleInitial"
									id="middleInitial"
									className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									placeholder=""
									value={profileForm.middleInitial}
									onChange={handleProfileInputChange}
								/>
							</div>
							<div className="col-span-6 sm:col-span-3">
								<label
									htmlFor="firstLastName"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									First Last Name
								</label>
								<input
									type="text"
									name="firstLastName"
									id="firstLastName"
									className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									placeholder=""
									value={profileForm.firstLastName}
									onChange={handleProfileInputChange}
									required
								/>
							</div>
							<div className="col-span-6 sm:col-span-3">
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
									className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									placeholder=""
									value={profileForm.secondLastName}
									onChange={handleProfileInputChange}
								/>
							</div>
							<div className="col-span-6 sm:col-span-3">
								<label
									htmlFor="profileImageURL"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Profile Image URL
								</label>
								<input
									type="text"
									name="profileImageURL"
									id="profileImageURL"
									className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									placeholder=""
									value={profileForm.profileImageUrl}
									onChange={handleProfileInputChange}
								/>
							</div>
							<div className="col-span-6 sm:col-span-3">
								<label
									htmlFor="email"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Email
								</label>
								<input
									type="email"
									name="email"
									id="email"
									className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									placeholder=""
									value={profileForm.email}
									onChange={handleProfileInputChange}
									required
								/>
							</div>
							<div className="col-span-6 sm:col-full">
								<button
									className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
									type="submit"
								>
									Save all
								</button>
							</div>
						</div>
					</form>
        </div>
				<div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
					<h3 className="mb-4 text-xl font-semibold dark:text-white">
						Password information
					</h3>
					<form onSubmit={handlePasswordSave}>
						<div className="grid grid-cols-6 gap-6">
							<div className="col-span-6 sm:col-span-3">
								<label
									htmlFor="current-password"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Current password
								</label>
								<input
									type="text"
									name="current-password"
									id="current-password"
									className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									placeholder="••••••••"
									value={passwordForm.currentPassword}
									onChange={handlePasswordInputChange}
									required
								/>
							</div>
							<div className="col-span-6 sm:col-span-3">
								<label
									htmlFor="password"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									New password
								</label>
								<input
									data-popover-target="popover-password"
									data-popover-placement="bottom"
									type="password"
									id="password"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="••••••••"
									value={passwordForm.newPassword}
									onChange={handlePasswordInputChange}
									required
								/>
								<div
									data-popover
									id="popover-password"
									role="tooltip"
									className="absolute z-10 invisible inline-block text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
								>
									<div className="p-3 space-y-2">
										<h3 className="font-semibold text-gray-900 dark:text-white">
											Must have at least 6 characters
										</h3>
										<div className="grid grid-cols-4 gap-2">
											<div className="h-1 bg-orange-300 dark:bg-orange-400"></div>
											<div className="h-1 bg-orange-300 dark:bg-orange-400"></div>
											<div className="h-1 bg-gray-200 dark:bg-gray-600"></div>
											<div className="h-1 bg-gray-200 dark:bg-gray-600"></div>
										</div>
										<p>It’s better to have:</p>
										<ul>
											<li className="flex items-center mb-1">
												<svg
													className="w-4 h-4 mr-2 text-green-400 dark:text-green-500"
													aria-hidden="true"
													fill="currentColor"
													viewBox="0 0 20 20"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														fillRule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clipRule="evenodd"
													></path>
												</svg>
												Upper & lower case letters
											</li>
											<li className="flex items-center mb-1">
												<svg
													className="w-4 h-4 mr-2 text-gray-300 dark:text-gray-400"
													aria-hidden="true"
													fill="currentColor"
													viewBox="0 0 20 20"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														fillRule="evenodd"
														d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
														clipRule="evenodd"
													></path>
												</svg>
												A symbol (#$&)
											</li>
											<li className="flex items-center">
												<svg
													className="w-4 h-4 mr-2 text-gray-300 dark:text-gray-400"
													aria-hidden="true"
													fill="currentColor"
													viewBox="0 0 20 20"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														fillRule="evenodd"
														d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
														clipRule="evenodd"
													></path>
												</svg>
												A longer password (min. 12 chars.)
											</li>
										</ul>
									</div>
									<div data-popper-arrow></div>
								</div>
							</div>
							<div className="col-span-6 sm:col-span-3">
								<label
									htmlFor="confirm-password"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Confirm password
								</label>
								<input
									type="text"
									name="confirm-password"
									id="confirm-password"
									className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									placeholder="••••••••"
									value={passwordForm.confirmPassword}
									onChange={handlePasswordInputChange}
									required
								/>
							</div>
							<div className="col-span-6 sm:col-full">
								<button
									className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
									type="submit"
								>
									Save all
								</button>
							</div>
						</div>
					</form>
				</div>
      </div>
    </div>
    <div className="grid grid-cols-1 px-4 xl:grid-cols-2 xl:gap-4">
      <div
        className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 xl:mb-0"
      >
        <div className="flow-root">
          <h3 className="text-xl font-semibold dark:text-white">Email Notifications</h3>
          <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
        You can set up College Toolbox to get email notifications
					</p>
					<div className="divide-y divide-gray-200 dark:divide-gray-700">
						{/* Item 1 */}
					<div className="flex items-center justify-between pt-4">
						<div className="flex flex-col flex-grow">
							<div className="text-lg font-semibold text-gray-900 dark:text-white">
								Course Change Notifications
							</div>
							<div className="text-base font-normal text-gray-500 dark:text-gray-400">
								Send me an email when a course I had in my schedule is no longer available
							</div>
						</div>
						{/* Assuming ToggleSwitch is a React component */}
						<ToggleSwitch id="buyer-rev" checked={hasCourseNotifications} onChange={toggleCourseNotifications} />
					</div>
				</div>
				<div className="mt-6">
					<button
						className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
					>
						Save all
					</button>
				</div>
        </div>
      </div>
    </div>
	</>
  );
}

export default UserSettings;
