import { FaSearch, FaShoppingCart, FaBell, FaUser } from 'react-icons/fa'
const Header = () => {
  return (
    <header className="bg-slate-300 fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 shadow-md">
      {/* Logo */}
      <h2 className="text-xl font-bold flex-shrink-0">Gulit</h2>

      {/* Search Bar */}
      <div className="flex items-center bg-white px-2 py-1 rounded-md shadow-md w-72">
        <input
          type="text"
          placeholder="Search"
          className="outline-none px-2 py-1 w-full"
        />
        <button className="text-gray-600">
          <FaSearch />
        </button>
      </div>

      {/* Cart & User Icons */}
      <div className="flex space-x-4 flex-shrink-0 justify-between">
        <button>
          <FaShoppingCart className="text-xl text-lime-600" />
        </button>
        <button>
          <FaBell className="text-xl text-blue-500" />
        </button>
        <button>
          <FaUser className="text-xl text-gray-700" />
        </button>
      </div>
    </header>
  )
}

export default Header
