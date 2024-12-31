import { useState } from "react";

function Colordropdown() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("gray");

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setIsDropdownOpen(false); // Close the dropdown after selecting a color
  };

  return (
    <div className="relative inline-block z-20">
      {/* Dropdown Button */}
      <button
        className={`z-20 flex items-center justify-center w-10 h-10 rounded-full bg-${selectedColor}-400`}
        onClick={handleToggleDropdown}
      >
        {/* Selected Color */}
        <div className={`z-20 h-5 w-5 rounded-full bg-${selectedColor}-400`}></div>
      </button>

      {/* Dropdown Options */}
      <div
        className={` z-20 absolute right-0 mt-2 w-24 bg-white border rounded shadow-lg transition-opacity ${
          isDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className=" z-20 h-5 w-5 bg-red-600 rounded-full m-2 cursor-pointer"
          onClick={() => handleColorChange("red")}
        ></div>
        <div
          className=" z-20h-5 w-5 bg-yellow-300 rounded-full m-2 cursor-pointer"
          onClick={() => handleColorChange("yellow")}
        ></div>
        <div
          className=" z-20 h-5 w-5 bg-green-500 rounded-full m-2 cursor-pointer"
          onClick={() => handleColorChange("green")}
        ></div>
      </div>
    </div>
  );
}

export default Colordropdown;
