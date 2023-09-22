import React, {useState, useEffect} from 'react';
import { url } from '../lib/data';
import { fetchProfile, logout } from '../services/authentication';
import type { User } from '../types/entities';

const UserDropdown = () => {
    const [profileData, setProfileData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
					fetchProfile().then(
						(profile)=>{
							setProfileData(profile)
          		setLoading(false)
						}
					).catch(
						((err)=>{
							console.error(err)
							setLoading(false)
						})
					)
          
      }, []);
    

    return (
			<div className="flex items-center ml-2">
      <div>
        <button
          type="button"
          id="user-menu-button-2"
          aria-expanded="false"
          data-dropdown-toggle="dropdown-2"
        >
          <span className="sr-only">Open user menu</span>
          {profileData?.profileImageUrl ?
					   <div className="w-40 h-40 rounded-full" style={{maxWidth:"40px",maxHeight: "40px"}}>
						 <img
							 src={profileData.profileImageUrl}
							 alt="Profile Picture"
							 className="object-cover w-full h-full rounded-full"
						 />
					 </div> :<svg
            className="w-5 h-5 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="gray"
            viewBox="0 0 14 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-2 3h4a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"
            />
          </svg>}
        </button>
      </div>
      {/* Dropdown menu */}
      <div
        className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
        id="dropdown-2"
    >
				{profileData	&& <div className="px-4 py-3" role="none">
				<p className="text-sm text-gray-900 dark:text-white" role="none">
						{profileData.fullName}
				</p>
				<p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
						{profileData.email}
				</p>
				</div>}
        <ul className="py-1" role="none">
            <li>
                <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                role="menuitem"
                >
                Settings
                </a>
            </li>
            {!loading && profileData ?
            <li>
                <a
                href={url('')}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                role="menuitem"
                onClick={()=>logout()}
                >
                Sign out
                </a>
            </li>
                :
            <li>
                <a
                href={url('authentication/sign-in')}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                role="menuitem"
                >
                Sign in
                </a>
            </li>
            }
        </ul>
    </div>
    </div>
    
    );
};

export default UserDropdown;
