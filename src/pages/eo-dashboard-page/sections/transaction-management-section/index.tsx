export default function TransactionManagement() {
  return (
    <div className="flex flex-col gap-4">
        {/* Organizers can accept, reject, and view user payment proofs. */}
      <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold"
                > Transaction Management
            </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold"
                > Accepted Transactions
            </h3>
            <p className="text-base font-bold">coming soon</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold"
                > Rejected Transactions </h3>
            <p className="text-base font-bold">coming soon</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold"
                > User Payment Proof</h3>
            <p className="text-base font-bold">coming soon</p>
        </div>
      </div>
    </div>
  );
}