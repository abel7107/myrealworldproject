function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            Lost<span className="text-blue-500">Link</span>
          </h1>
        </div>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="/"
            className="text-gray-300 transition hover:text-white"
          >
            Home
          </a>

          <a
            href="/items"
            className="text-gray-300 transition hover:text-white"
          >
            Browse Items
          </a>

          <a
            href="/report"
            className="text-gray-300 transition hover:text-white"
          >
            Report Item
          </a>
        </div>

        {/* Authentication */}
        <div className="flex items-center gap-3">
          <button className="rounded-lg px-4 py-2 text-gray-300 transition hover:text-white">
            Login
          </button>

          <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700">
            Sign Up
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;