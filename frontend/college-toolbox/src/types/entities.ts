import type { endpointsToOperations } from '../pages/api/[...entity].js';

export type EndpointsToOperations = typeof endpointsToOperations;
export type Endpoint = keyof EndpointsToOperations;

export type Products = Product[];
export interface Product {
	name: string;
	category: string;
	technology: string;
	id: number;
	description: string;
	price: string;
	discount: string;
}

export interface NewProfile {
	firstName: string;
	initial?: string;
	firstLastName: string;
	secondLastName?: string;
	email: string;
	password: string;
	profileImageUrl?: string;
}

export interface Profile extends Record<string, string> {
	firstName: string;
	initial?: string;
	firstLastName: string;
	secondLastName?: string;
	email: string;
	profileImageUrl?: string;
}

// Scholarship Interface
export interface ScholarshipApplication {
	id: number;
	name: string;
	deadline: Date;
	status: string;
}

export interface CourseSectionSchedule {
	courseCode: string; // ie. QUIM3132
	courseName: string; // ie. LABORATORIO DE QUIMICA 1
	professor: string; // ie. Marko Schutz
	credits: number;
	sectionCode: string; // ie. 066L
	sectionId: number; // ie. 25
	timeBlocks: SpaceTimeBlock[];
}

export interface SpaceTimeBlock {
	room: string; // ie. S121
	building: string; // building name ie. Edificio Jesus T. Pineiro
	location: string; // google maps static pin url for building
	day: number; // between 0-6 0->Monday 6->Sunday
	startTime: string; // in 24 hour time
	endTime: string; // in 24 hour time ie. 17:30
}

export interface GeneratedSchedule {
	courses: CourseSectionSchedule[];
}

export interface FilteredCourse {
	code: string;
	filters?: CourseFilters;
}
export interface AcademicYearOptions {
	term: string;
	year: string;
}

export interface ScheduleGenerationOptions extends AcademicYearOptions{
	maxSchedules?: number;
	minCredits?: number;
	maxCredits?: number;
}

export interface CourseFilters {
	startTime?: string;
	endTime?: string;
	days?: string;
	professor?: string;
}

export interface BusinessModel {
	ExistingSolutionId: number;
	BusinessModelType: string;
	Price: number; 
	Description: string;
}

export interface ResourcesModel {
	Name: string;
	Description: string;
	URL: string;
	Icon: string;
	Type: string[];
	Rating: number;
	RatingCount: number;
	Pros: string[];
	Cons: string[];
	LastUpdated: string;
	HasMobile: boolean;
	HasWeb: boolean; 
	BusinessModels: BusinessModel[];
}

interface CourseSearchSchedule {
	room: string;
	days: string;
	startTime: string;
	endTime: string;
}

export interface SavedScheduleModel {
    user_id: string
    id: number
    name: string
    term: string
    year: number
    schedule: GeneratedSchedule
}

export interface CourseSearchSection {
	courseCode: string;
	courseName: string;
	professor: string;
	credits: number;
	sectionCode: string;
	sectionId: number;
	schedules: CourseSearchSchedule[];
}
