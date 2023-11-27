import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import type { ResourcesModel } from '../../types/entities';
import { Modal } from 'flowbite-react';

const SolutionsView: React.FC<{ applications: ResourcesModel[] }> = ({ applications }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState<ResourcesModel | null>(null);

    const openModal = (app: ResourcesModel) => {
        setSelectedApp(app);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedApp(null);
    };

    function getDeviceAvailabity(device : string, hasDevice : boolean) {
        return (
            <div className='ml-3'>
                {device}{' '}
                {hasDevice ? (
                    <span className="text-green-600 font-extrabold">✓</span>
                ) : (
                    <span className="text-red-600 font-extrabold">X</span>
                )}
            </div>
        )
    }


	if (applications && applications.length===0) {
		return (
			<div className="bg-gray-200 rounded-lg p-4 dark:bg-gray-700 dark:text-white">
				<h2 className="text-2xl font-extrabold mb-2">Resource Hub</h2>

				<div className="h-144 overflow-y-auto grid place-items-center">
					<h1 className="text-5xl font-extrabold mb-2 text-gray-400">No applications match your specifications</h1>
				</div>
			</div>

		);
	}
	else{
    return (
        <div className="bg-gray-200 rounded-lg p-4 dark:bg-gray-700 dark:text-white">
            <h2 className="text-2xl font-extrabold mb-2">Resource Hub</h2>
            
            <div className="overflow-y-auto">
                <div className="grid grid-cols-4 gap-4 p-3">
                    {applications.map((app, index) => (
                        <button 
                            key={index} 
                            className="flex justify-between application-block relative bg-gray-300 dark:bg-gray-600 dark:border-gray-800 border-gray-400 border-2 rounded-xl hover:scale-105 dark:hover:border-blue-400 hover:border-blue-400 transition-transform"
                            onClick={() => openModal(app)} 
                            >
                            <div className="grid grid-cols-2 gap-1 ml-2">
                                <div className="p-3"> 
                                    <img 
                                        src={app.Icon} 
                                        alt={app.Name + " logo"} 
                                        className="object-cover rounded" 
                                    />
                                    <div 
                                        className="mb-2 mt-2 font-bold text-2xl" 
                                        style={{ textShadow: '-5px 4px 4px rgba(0, 0, 0, 0.25)' }}
                                        >
                                            {app.Name}
                                    </div>
                                </div>

                                <div>
                                    <div className="mt-2 text-left font-bold text-gray-800 dark:text-gray-300 text-lg">Category:</div>

                                    <div>
                                        {app.Type.map((type, index) => (
                                            <div key={index} className="items-center mb-1 ml-2 mr-3 bg-gray-500 text-white text-xs py-1 px-2 rounded-md col-span-1 self-start">
                                                    {type}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="text-left font-bold text-gray-800 dark:text-gray-300 text-lg">Payment Option:</div>

                                    <div className='mb-2'>
                                        {app.BusinessModels.map((model, index) => (
                                            <div key={index} className="items-center mb-1 ml-2 mr-3 bg-gray-500 text-white text-xs py-1 px-2 rounded-md col-span-1 self-start">
                                                    {`${model.BusinessModelType}: $${model.Price}`} 
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {selectedApp && (
                <Modal
                    dismissible
                    show={isModalOpen}
                    onClose={closeModal}
                >
                    <Modal.Header className ='bg-gray-200 dark:bg-gray-700 rounded-t-lg mb-0.5'>
                        <div className='flex items-center justify-between relative'>
                            <img 
                                src={selectedApp.Icon} 
                                alt={selectedApp.Name + " logo"} 
                                className="w-12 h-12 object-cover rounded" 
                            />
                            <span className='ml-2 text-bold'>{selectedApp.Name}</span>
                        </div>
                    </Modal.Header>

                    <Modal.Body className ='bg-gray-100 dark:bg-gray-700 rounded-b-lg'>
                        <div
                            className='text-black dark:text-white'
                            >
                            <div className="text-left font-bold text-lg">Description:</div>
                            <p className= 'p-2 text-justify'>{selectedApp.Description}</p>

														<div className="mb-2 font-bold text-lg">
															<div className="flex justify-between">
																<div className="text-left">Rating: {selectedApp.Rating}/5</div>
																<div className="text-right">Price: ${selectedApp.BusinessModels[0].Price}</div>
															</div>
														</div>

														<div
                                className='grid grid-cols-2 gap-2 mb-2'
                                >
                                <div className='p-2 bg-green-600 bg-opacity-30 border border-green-600 rounded-lg'>
                                    <div className="text-left font-bold text-lg">Pros:</div>
                                    {selectedApp.Pros.map((pro, index) => (
                                        <div key={index} className='ml-2'>• {pro}</div>
                                    ))}
                                </div>
                                <div className='p-2 bg-red-600 bg-opacity-30 border border-red-600 rounded-lg'>
                                    <div className="text-left font-bold  text-lg">Cons:</div>
                                    {selectedApp.Cons.map((con, index) => (
                                        <div key={index} className='ml-2'>• {con}</div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className='flex items-center text-lg'>
                                <div className="text-left font-bold">Available on:</div>
                                {getDeviceAvailabity("Mobile", selectedApp.HasMobile)} 
                                {getDeviceAvailabity("Desktop", selectedApp.HasWeb)}
                            </div>

                            <div className='flex items-center'>
                                <div className="text-left font-bold text-lg mr-2">For more information:</div>
                                <a href={`https://${selectedApp.URL}`} className="text-lg text-blue-600 hover:text-blue-800 underline-blue-800 visited:text-purple-600 visited:underline-purple-600 " target="_blank" rel="noopener noreferrer">
                                    {selectedApp.URL}
                                </a>
                            </div>

                            <div className="text-right font-bold text-lg mr-2">Last updated: {selectedApp.LastUpdated}</div>

                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
	}
}

export default SolutionsView;

