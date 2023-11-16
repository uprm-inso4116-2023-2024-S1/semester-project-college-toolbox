import type React from 'react';
import type { SavedScheduleModel } from '../../types/entities';

const SavedScheduleView: React.FC<{ applications: SavedScheduleModel[] }> = ({ applications }) => {
    return (
        <div className="bg-gray-200 rounded-lg p-4 dark:bg-gray-700 dark:text-white">
            <h2 className="text-2xl font-extrabold mb-2">Saved Schedules</h2>
            
            <div className="h-144 overflow-y-auto">
                <div className="grid grid-cols-4 gap-4 p-2">
                    {applications.map((saved_schedule, index) => (
                        <button 
                            key={index} 
                            className="application-block relative bg-gray-300 dark:bg-gray-600 dark:border-gray-800 border-gray-400 border-2 rounded-xl hover:scale-105 dark:hover:border-blue-400 hover:border-blue-400 transition-transform flex flex-col items-center p-4"
                        >
                            <div className="w-full bg-gray-400 dark:bg-gray-700 text-center py-2 rounded-t-xl font-bold text-lg">
                                {saved_schedule.name}
                            </div>

                            <div className="w-full bg-green-300 dark:bg-green-500 text-center py-2 rounded-b-xl font-bold text-lg my-0 mb-2">
                                {saved_schedule.term} | {saved_schedule.year}
                            </div>

                            <div
                                className="self-stretch border-t-2 border-gray-400 mb-1 my-1 w-full"
                            />

                            {saved_schedule.schedule.courses.map((course, courseIndex) => (
                                <div key={courseIndex} className="text-extrabold bg-green-400 dark:bg-green-600 p-1 rounded-lg w-full text-center my-1">
                                    {course.courseCode} - {course.sectionCode}
                                </div>
                            ))}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SavedScheduleView;





{/* <div className="h-144 overflow-y-auto">
    <div className="grid grid-cols-4 gap-4 p-2">
        {applications.map((app, index) => (
            <button key={index} className="flex items-center justify-between application-block relative bg-gray-300 dark:bg-gray-600 dark:border-gray-800 border-gray-400 border-2 rounded-xl hover:scale-105 dark:hover:border-blue-400 hover:border-blue-400 transition-transform">
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
</div> */}
