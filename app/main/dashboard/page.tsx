import UserHeader from "../../component/userHeader"

export default function dashboard() {
  return (
    <>
      <UserHeader />
      <div className = "container mx-auto px-4 mt-10">
        <h1 className="text-3xl font-bold mb-6 text-left">Welcome Back, User!</h1>
        <div className="overflow-x-auto shadow-lg border border-gray-300 rounded-lg">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-4 px-4 text-center">No.</th>
                  <th className="py-4 px-4 text-center">Name</th>
                  <th className="py-4 px-4 text-center">Description</th>
                  <th className="py-4 px-4 text-center">Date</th>
                  <th className="py-4 px-4 text-center">Location</th>
                  <th className="py-4 px-4 text-center">Status</th>
                </tr>
              </thead>
            </table>
          </div>
      </div>
    </>
  );
}
