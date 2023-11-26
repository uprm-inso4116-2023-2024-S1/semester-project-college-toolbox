import React, { useState, useEffect  } from 'react';
import { API_URL } from '../../app/constants';
import SearchBar from '../../components/SavedSchedules/SearchBar'
import type { SavedScheduleModel } from '../../types/entities';
import { getCookie } from '../../lib/data';
import SavedScheduleView from './SavedScheduleView';
import Filters from './Filters';

const SavedScheduleHub: React.FC = () => {
    const [savedSchedules, setSavedSchedules] = useState<SavedScheduleModel[]>([]);

    const handleDeleteSchedule = (deletedScheduleId: number) => {
        setSavedSchedules(currentApplications =>
          currentApplications.filter(schedule => schedule.id !== deletedScheduleId)
        );
      };

    const handleSearchSchedules = async (value: string) => {
        try {
            if (value !== "") {
                const requestBody = {
                    prefix: value,
                    auth_token: getCookie('auth_token')
                };
            
                const response = await fetch(`${API_URL}/schedules/filter/prefix`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });
            
                if (!response.ok) {
                    throw new Error(`Validation request failed: ${response.statusText}`);
                }
            
                const data = await response.json();
                if (data.length === 0){
                    showAllSavedSchedules();
                }
                setSavedSchedules(data);
            }
            else {
                setSavedSchedules([]);
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
        console.log(value);
    };

    const showAllSavedSchedules = async () => {

        try {
            const requestBody = {
                auth_token: getCookie('auth_token')
            };
        
            const response = await fetch(`${API_URL}/get_all_save_schedules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
        
            if (!response.ok) {
                throw new Error(`Validation request failed: ${response.statusText}`);
            }
        
            const data = await response.json();
            setSavedSchedules(data);
        } catch (error) {
            console.error("Error fetching saved schedules:", error);
        }
    };



    useEffect(() => {
        showAllSavedSchedules();
    }, []);



    return (
        <div className="Saved-Schedule-Hub-container">
            <SearchBar onSearch={handleSearchSchedules} />
            <div className="gap-4 mx-4 mt-4">
                <div>
                    <SavedScheduleView applications={savedSchedules} onDeleteSchedule={handleDeleteSchedule}/>
                </div>
            </div>
        </div>
    );
}

export default SavedScheduleHub;
