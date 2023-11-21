class ScholarshipApplication {
	constructor(fullName, email, essay, resumeFileName) {
		// Basic validation for required fields
		if (!fullName || !email || !essay || !resumeFileName) {
			throw new Error(
				'Full Name, Email, Essay, and Resume File Name are required.',
			);
		}

		// Basic email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw new Error('Invalid email format.');
		}

		// Additional validation for fullName length
		if (fullName.length < 2 || fullName.length > 100) {
			throw new Error('Full Name must be between 2 and 100 characters.');
		}

		// Additional validation for essay length
		if (essay.length < 50 || essay.length > 1000) {
			throw new Error('Essay must be between 50 and 1000 characters.');
		}

		// Additional validation for resumeFileName length and allowed file types
		if (resumeFileName.length < 1 || resumeFileName.length > 255) {
			throw new Error('Resume File Name must be between 1 and 255 characters.');
		}

		const allowedFileTypes = ['.pdf', '.doc', '.docx'];
		const fileExtension = resumeFileName
			.substring(resumeFileName.lastIndexOf('.'))
			.toLowerCase();
		if (!allowedFileTypes.includes(fileExtension)) {
			throw new Error('Invalid file type. Allowed types: .pdf, .doc, .docx');
		}

		this.fullName = fullName;
		this.email = email;
		this.essay = essay;
		this.resumeFileName = resumeFileName;
	}
}

class ScholarshipApplicationFactory {
	createApplication(fullName, email, essay, resumeFileName) {
		try {
			return new ScholarshipApplication(fullName, email, essay, resumeFileName);
		} catch (error) {
			console.error('Error creating Scholarship Application:', error.message);
			return null; // Or handle the error in an appropriate way for your application
		}
	}
}

export default ScholarshipApplicationFactory;
