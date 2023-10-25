import React from 'react';
import { API_URL } from '../../app/constants';



    
const SolutionsView: React.FC<{ applications: any[] }> = ({ applications }) => {
    return (
        <div className="bg-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Solutions view</h2>
            <div className="grid grid-cols-3 gap-4">
                {applications.map((app, index) => (
                    <div key={index} className="application-block">
                        <img src={app.Icon} alt={app.Name + " logo"} className="object-cover rounded w-8 h-8" />
                        <span>{app.Name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default SolutionsView;
