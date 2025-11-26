import Header from "../../component/header"

export default function dashboard() {
  return (
    <>
      <Header />
      {/* <section className="relative h-screen flex items-center justify-center overflow-hidden"> */}
      <div className = "container mx-auto px-4 mt-10">
        <div className="overflow-x-auto shadow-lg border border-gray-300 rounded-lg">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-4 px-4 text-center">No.</th>
                  <th className="py-4 px-4 text-center">File Name</th>
                  <th className="py-4 px-4 text-center">File Type</th>
                  <th className="py-4 px-4 text-center">Authorized Users</th>
                  <th className="py-4 px-4 text-center">Download File Decrypted</th>
                </tr>
              </thead>
            </table>
          </div>
      </div>
      {/* </section> */}
    </>
  );
}
