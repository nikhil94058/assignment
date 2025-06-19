// src/components/Header.jsx
import React from 'react';
import DarkModeToggle from './DarkModeToggle';

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
        ⚡ TLE Eliminator
      </h1>
      <DarkModeToggle />
    </header>
  );
};

export default Header;
