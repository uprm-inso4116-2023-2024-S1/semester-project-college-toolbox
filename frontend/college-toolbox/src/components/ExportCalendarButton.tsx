import React from 'react';


interface ExportButtonProps {
	courses: number[]
	term: string
}

const ExportButton: React.FC<ExportButtonProps> = ({ courses, term }) => {
  const handleDownloadClick = async () => {
    try {

      const response = await fetch('/create_calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
				body: JSON.stringify({courses, term}),
        credentials: 'include',
      });

      if (!response.ok) {
        // Handle error, show a message, or throw an exception
        console.error('Failed to fetch calendar data');
        return;
      }

      // Convert the response to a Blob
      const blob = await response.blob();

      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = 'calendar.ics';

      // Trigger the download
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Cleanup
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
    }
  };

  return (
    <button
      type="button"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      onClick={handleDownloadClick}
    >
      Export
    </button>
  );
};

export default ExportButton;
