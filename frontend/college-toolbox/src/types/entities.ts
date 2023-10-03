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
	courseCode: string;
	courseName: string;
	sectionCode: string;
	sectionId: number;
	timeBlocks: SpaceTimeBlock[];
}

export interface SpaceTimeBlock {
	room: string;
	day: number; // between 0-6
	startTime: string; // in 24 hour time
	endTime: string; // in 24 hour time ie. 17:30
}
