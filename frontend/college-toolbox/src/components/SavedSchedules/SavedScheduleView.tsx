import React, {useState} from 'react';
import type { SavedScheduleModel } from '../../types/entities';
import { Modal } from 'flowbite-react';
import WeeklyCalendar from '../tuitionscheduler/WeeklyCalendar';

const SavedScheduleView: React.FC<{ applications: SavedScheduleModel[] }> = ({ applications }) => {
    const [openModal, setOpenModal] = useState<string | undefined>();
    const [schedule, setSchedule] = useState<SavedScheduleModel | undefined>();
    const modalProps = { openModal, setOpenModal, schedule, setSchedule };


    function termEnumToString(term: string): string {
        const conversions = {
            '1erSem': 'Fall',
            '2doSem': 'Spring',
            '1erVer': 'First Summer',
            '2doVer': 'Second Summer',
        };
        return (conversions as Record<string, string>)[term] ?? '';
    }

    return (
        <div className="bg-gray-200 rounded-lg p-4 dark:bg-gray-700 dark:text-white">
            <h2 className="text-2xl font-extrabold mb-2">Saved Schedules</h2>

            <div
                className="self-stretch border-t-2 border-gray-400 dak:border-gray-500 mb-1 my-1 w-full"
            />
            
            <div className="overflow-y-auto">
                <div className="grid grid-cols-4 gap-4 p-3">
                    {applications.map((saved_schedule, index) => (
                        <button 
                            key={index} 
                            className="application-block relative bg-gray-300 dark:bg-gray-600 dark:border-gray-800 border-gray-400 border-2 rounded-xl hover:scale-105 dark:hover:border-blue-400 hover:border-blue-400 transition-transform flex flex-col items-center p-4"
                            onClick={() => {
                                setOpenModal('dismissible');
                                setSchedule(saved_schedule); // Set the schedule here
                            }}
                        >
                            <div className="w-full bg-gray-400 dark:bg-gray-700 text-center py-2 rounded-t-xl font-bold text-lg">
                                {saved_schedule.name}
                            </div>

                            <div className="w-full bg-green-300 dark:bg-green-500 text-center py-2 rounded-b-xl font-bold text-lg my-0 mb-2">
                                {termEnumToString(saved_schedule.term)} {saved_schedule.year} Semester
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
                <Modal
                    dismissible
                    show={modalProps.openModal === 'dismissible'}
                    onClose={() => setOpenModal(undefined)}
                    >
                    <Modal.Header>{modalProps.schedule?.name}</Modal.Header>
                    <Modal.Body>
                        <div className="space-y-2">
                            {/* Table to display course information */}
                            <div className="bg-white dark:bg-gray-800">
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-left text-xs font-bold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-left text-xs font-bold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                                Section
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-left text-xs font-bold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                                Credits
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-left text-xs font-bold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                                Professor
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modalProps.schedule?.schedule.courses.map((course, index) => (
                                            <tr key={index}>
                                                <td className="px-2 py-1 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-900 dark:text-gray-200">
                                                    {course.courseName}
                                                </td>
                                                <td className="px-2 py-1 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-900 dark:text-gray-200">
                                                    {course.courseCode} - {course.sectionCode}
                                                </td>
                                                <td className="px-2 py-0.5 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-900 dark:text-gray-200">
                                                    {course.credits}
                                                </td>
                                                <td className="px-2 py-0.5 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-900 dark:text-gray-200">
                                                    {course.professor}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                {/* Your WeeklyCalendar component */}
                                <WeeklyCalendar
                                    schedule={modalProps.schedule?.schedule}
                                    term={modalProps.schedule?.term || 'No Term'}
                                    year={modalProps.schedule?.year.toString() || 'No Year'}
                                    isInModal={true}
                                />
                            </div>
                            <button
                                className='bg-red-700 border-2 border-red-700 rounded-lg py-1 px-2 text-white hover:bg-red-800'
                                >
                                Delete
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}

export default SavedScheduleView;



