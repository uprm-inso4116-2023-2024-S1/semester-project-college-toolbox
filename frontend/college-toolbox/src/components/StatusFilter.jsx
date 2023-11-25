import Filter from './Filter';
class StatusFilter extends Filter {
	constructor(selectedStatus) {
		super();
		this.selectedStatus = selectedStatus;
	}

	applyFilter(scholarships) {
		if (!Array.isArray(scholarships)) {
			return [];
		}

		return scholarships.filter((scholarship) => {
			return this.status === 'All' || scholarship.status === this.status;
		});
	}
}

export default StatusFilter;
