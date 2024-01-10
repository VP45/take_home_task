import React from "react";

const base =
  "inline-flex items-center px-4 py-2 border text-lg font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800";
const prim =
  "inline-flex items-center px-4 py-2 border text-lg font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 text-white";
const sec =
  "border-transparent shadow-sm text-white bg-empirica-600 hover:bg-empirica-700";

export function Button4({
  children,
  handleClick = null,
  className = "",
  primary = false,
  type = "button",
  autoFocus = false,
}) {
  return (
    <button
      type={type}
      onClick={handleClick}
      className={`${base} ${primary ? prim : sec} ${className}`}
      autoFocus={autoFocus}
    >
      {children}
    </button>
  );
}
