import React, { useState } from 'react';
import { API_URL } from '../../app/constants';


export interface ScheduleOptions {
	courses: string[]
	setCourses: React.Dispatch<React.SetStateAction<string[]>>
	
}

const ScheduleOptions: React.FC<ScheduleOptions> = ({courses, setCourses}) => {
    // State for course list and input values
    const [courseID, setCourseID] = useState('');
    const [section, setSection] = useState('');


    const addCourse = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (courseID.trim() !== '') {
            try {
                let courseString = `${courseID}`;

                if (section.trim() !== '') {
                    courseString += `-${section}`;
                }

                const isValid = await validateCourse(courseID, section);
                if (isValid) {
                    setCourses([...courses, courseString]);
    
                } else {
                    alert(`The course or section (${courseString}) is invalid. Please try again.`);
                }
                // Reset input fields
                setCourseID('');
                setSection('');
            } catch (error) {
                alert('There was an error validating the course. Please try again later.');
            }
        }
    };


    const deleteCourse = (indexToDelete: number) => {
        // Filter out the course with the specified index
        const updatedCourses = courses.filter((_, index) => index !== indexToDelete);
        setCourses(updatedCourses);
    };


    async function validateCourse(courseID: string, section: string): Promise<boolean> {
        const requestBody = {
            course_id: courseID,
            section: section
        };
    
        const response = await fetch(`${API_URL}/validate_course_id/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });
    
        if (!response.ok) {
            throw new Error(`Validation request failed: ${response.statusText}`);
        }
    
        const data: { is_valid: boolean } = await response.json();
        return data.is_valid;
    }
    

    return (
    <div className="p-6 relative">
        <div className="grid grid-cols-5 gap-3">
            <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg col-span-2">

                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white p-1 mb-5">
                    Course Selection
                </h2>

                <form onSubmit={addCourse}>
                    <div className="grid gap-4 mb-6 md:grid-cols-5">
                        <div className='col-span-2'>
                            <label htmlFor="course_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Course ID</label>
                            <input  type="text" 
                                    id="course_name" 
                                    value={courseID} onChange={(e) => setCourseID(e.target.value.toUpperCase())}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="i.e. CIIC3015, BIOL3041"
                                    required/>
                        </div>
                        <div className='col-span-2'>
                            <label htmlFor="course_section" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Course section</label>
                            <input  type="text" 
                                    id="course_section" 
                                    value={section} onChange={(e) => setSection(e.target.value.toUpperCase())}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="i.e. 030, 116 (Optional)"/>
                        </div>
                        <div className='col-span-1 flex'>
                            <button type="submit"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-extrabold rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 my-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 self-end">
                                +
                            </button>
                        </div>
                    </div>
                </form>

                <div className="space-y-2 overflow-y-auto h-52">
                    {courses.map((course, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-2 rounded border dark:border-gray-700 flex justify-between items-center">
                        <span className="text-gray-900 dark:text-white">{course}</span>
                        <button onClick={() => deleteCourse(idx)}
                                className="bg-red-500 text-white rounded-lg w-6 h-6 focus:outline-none hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 dark:text-gray-300">
                            X
                        </button>
                    </div>
                    ))}
                </div>

            </div>

            <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg col-span-3">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white p-1 mb-5">
                Filters
                </h2>
            </div>

        </div>
    </div>

  );
}

export default ScheduleOptions;
