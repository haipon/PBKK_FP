import Header from "../../component/header";

export default function Login() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

      <section className="relative h-screen flex items-center justify-center overflow-hidden -translate-y-8">
        <div className="w-full max-w-lg p-10 bg-white border border-[#95A6D3] rounded-2xl shadow-sm">
          <h2 className="text-3xl font-medium text-center text-[#4A5682] mb-8">
            Log in
          </h2>

          <form className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring focus:ring-[#95A6D3]"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Your password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring focus:ring-[#95A6D3]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full text-lg font-medium text-white cursor-pointer"
              style={{ backgroundColor: "#95A6D3" }}
            >
              Log In
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
