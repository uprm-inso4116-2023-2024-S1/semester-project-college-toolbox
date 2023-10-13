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
            if (!isValidCourseFormat(courseID)){
                alert('Invalid format for course ID. Please check your input and try again.');
                return
            }
            if (!isValidSectionFormat(section)){
                alert('Invalid format for course section. Please check your input and try again.');
                return
            }

            try {
                let courseString = `${courseID}`;

                if (section.trim() !== '') {
                    
                    courseString += `-${section}`;
                }

                const isValid = await validateCourse(courseID, section);
                if (isValid) {
                    setCourses([...courses, courseString]);
                    // Reset input fields
                    setCourseID('');
                    setSection('');

                } else {
                    alert(`The course or section (${courseString}) does not exist. Please try again.`);
                }
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

    function isValidCourseFormat(courseID: string): boolean {
        const courseIDRegex = /^[A-Z]{4}\d{4}$/;
    
        return courseIDRegex.test(courseID);
    }

    function isValidSectionFormat(section: string): boolean {
        const sectionRegex = /^(\d{3}[A-Z]?)?$/; 
    
        return sectionRegex.test(section);
    }

  return (
    <div className="relative">
      <div className="bg-gray-200 dark:bg-gray-800 rounded-lg col-span-2 p-1">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white p-1 mb-1">
          Course Selection
        </h2>

        <form onSubmit={addCourse}>
          <div className="grid grid-cols-10 gap-px">
            <div className="col-span-4">
              <label htmlFor="course_name" className="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-white p1 overflow-ellipsis">
                Course ID <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="col-span-4">
              <label htmlFor="course_section" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white overflow-ellipsis">
                Course Section
              </label>
            </div>
            <div className="col-span-2" />

            <div className="col-span-4">
              <input
                type="text"
                id="course_name"
                value={courseID}
                onChange={(e) => setCourseID(e.target.value.toUpperCase())}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="i.e. CIIC3015"
                required
              />
            </div>
            <div className="col-span-4">
              <input
                type="text"
                id="course_section"
                value={section}
                onChange={(e) => setSection(e.target.value.toUpperCase())}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="i.e. 030, 116L"
              />
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm w-full px-2.5 py-2 text-center text-white"
              >
                Add
              </button>
            </div>
          </div>
        </form>
        {(courses.length > 0) && <div className="space-y-2 overflow-y-auto h-52 mt-1">
          {courses.map((course, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-2 rounded border dark:border-gray-700 flex justify-between items-center">
              <span className="text-gray-900 dark:text-white">{course}</span>
							<button className="  rounded-sm w-6 h-6 focus:outline-none hover:bg-gray-300 dark:hover:bg-gray-500 dark:text-gray-300">
								<svg
									className="w-6 h-6 text-gray-800 dark:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 20 20"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M7.75 4H19M7.75 4a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 4h2.25m13.5 6H19m-2.25 0a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 10h11.25m-4.5 6H19M7.75 16a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 16h2.25"
									/>
								</svg>
							</button>
              <button
                onClick={() => deleteCourse(idx)}
                className="bg-red-500 text-white rounded-lg w-6 h-6 focus:outline-none hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 dark:text-gray-300"
              >
                X
              </button>
            </div>
          ))}
        </div>}
      </div>

      <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg col-span-3">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white p-1 mb-5">Filters</h2>
      </div>
    </div>
  );
};

export default ScheduleOptions;
