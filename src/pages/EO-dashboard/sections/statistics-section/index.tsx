export default function BasicStatistics() {
    return (
      <div className="flex flex-col gap-4">
        {/* Add your statistics components here */}
        {/* You can use charts or tables to display data */}
        <div className="flex items-center justify-between text-orange-600">
          <h2 className="text-2xl font-bold">Basic Statistics</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Total Attendees</h3>
            <p className="text-2xl font-bold">...</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">New Registrations</h3>
            <p className="text-2xl font-bold">...</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Total Sessions</h3>
            <p className="text-2xl font-bold">...</p>
          </div>
        </div>
      </div>
    );
  }