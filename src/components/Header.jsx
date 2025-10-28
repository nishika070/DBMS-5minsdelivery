import React from "react";

const Header = ({ hostelId, isLoggedIn, onLogout }) => {
  return (
    <div className="w-full bg-red-500 text-white shadow-md mb-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold">🍜</span>
          <span className="text-2xl font-bold tracking-wide">Maggishop</span>
        </div>

        {/* User Info + Logout */}
        <div className="flex items-center gap-4">
          <span className="bg-red-600 px-3 py-1 rounded-md text-sm">
            {isLoggedIn ? `User: ${hostelId}` : "Guest"}
          </span>
          {isLoggedIn && (
            <button
              onClick={onLogout}
              className="bg-white text-red-500 font-semibold px-3 py-1 rounded-md hover:bg-gray-100 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
