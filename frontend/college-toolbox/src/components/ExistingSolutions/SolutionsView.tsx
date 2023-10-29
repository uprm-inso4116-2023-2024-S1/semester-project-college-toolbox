import type React from 'react';
import { API_URL } from '../../app/constants';
import type { ResourcesModel } from '../../types/entities';

const SolutionsView: React.FC<{ applications: ResourcesModel[] }> = ({ applications }) => {
    return (
        <div className="bg-gray-200 rounded-lg p-4 dark:bg-gray-700 dark:text-white">
            <h2 className="text-2xl font-extrabold mb-2">Resource Hub</h2>
            
            <div className="h-144 overflow-y-auto">
                <div className="grid grid-cols-4 gap-4 p-2">
                    {applications.map((app, index) => (
                        <button key={index} className="flex items-center justify-between application-block relative bg-gray-300 dark:bg-gray-600 dark:border-gray-800 border-gray-400 border-2 rounded-xl hover:scale-105 dark:hover:border-blue-400 transition-transform">
                            <div className="grid grid-cols-2 gap-1 items-center ml-2">
                                <div className="ml-2 mt-2 mb-2 mr-2 rounded-full bg-white col-span-1"> 
                                    <img 
                                        src={app.Icon} 
                                        alt={app.Name + " logo"} 
                                        className="object-cover rounded" 
                                    />
                                </div>
                                <div className="mr-1 mt-2 bg-gray-500 text-white text-xs py-1 px-2 rounded-md col-span-1 self-start">
                                    {app.Type}
                                </div>
                                
                                <span 
                                    className="mb-2 font-bold text-2xl" 
                                    style={{ textShadow: '-5px 4px 4px rgba(0, 0, 0, 0.25)' }}
                                >
                                    {app.Name}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SolutionsView;


// {applications.map((app, index) => (
//     <div key={index} className="application-block relative p-2 mb-20 border rounded-md">
//         {/* Logo on top left */}
//         <div className="absolute top-0 left-0 w-2/3">
//             <img src={app.Icon} alt={app.Name + " logo"} className="object-cover rounded w-full h-24" />
//         </div>
//         {/* App name below the logo */}
//         <div className="absolute left-0 bottom-0 w-2/3 pb-1 pl-2">
//             <span className="font-bold">{app.Name}</span>
//         </div>
//         {/* App type chip on the right */}
//         <div className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-blue-500 text-white text-xs py-1 px-2 rounded-md">
//             {app.Type}
//         </div>
//     </div>
// ))}
