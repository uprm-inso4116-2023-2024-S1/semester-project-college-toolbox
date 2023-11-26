// YearFilter.js
import { format, parse, isThisMonth } from 'date-fns';
import Filter from './Filter';

class YearFilter extends Filter {
	constructor(selectedYear, uniqueYears) {
		super();
		this.selectedYear = selectedYear;
		this.uniqueYears = uniqueYears;
	}

	applyFilter(scholarships) {
		if (!Array.isArray(scholarships)) {
			return [];
		}

		return scholarships.filter((scholarship) => {
			if (this.year === 'All') {
				return true;
			} else if (this.year === 'Recent') {
				const currentMonthYear = format(new Date(), 'yyyy-MM');
				return scholarship.deadline.startsWith(currentMonthYear);
			} else {
				return scholarship.deadline.startsWith(this.year);
			}
		});
	}
}

export default YearFilter;
