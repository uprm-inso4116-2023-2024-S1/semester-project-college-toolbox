// Filter.js
class Filter {
	constructor() {
		if (new.target === Filter) {
			throw new TypeError('Cannot instantiate abstract class.');
		}
	}

	applyFilter(scholarships) {
		throw new Error('Method applyFilter must be implemented.');
	}
}

export default Filter;
