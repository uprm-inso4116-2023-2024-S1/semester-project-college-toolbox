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

export type Users = User[];
export interface User {
  fullName: string;
  email: string;
	profileImageUrl?: string;
}

export interface Profile {
	fullName: string;
	email: string;
	profileImageUrl: string;
}

//Scholarship Interface
export interface ScholarshipApplication {
  id: number;
  name: string;
  deadline: Date;
  status: string;
}
