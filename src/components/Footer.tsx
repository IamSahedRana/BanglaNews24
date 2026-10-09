import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-6 text-sm text-gray-500 font-serif">
      <div className="container mx-auto px-4 flex items-left justify-between">
        {/* Centered copyright text relative to the remaining space */}
        <div className="flex-1 text-left">
          <p>© 2026 Bangla News 24</p>
        </div>

        {/* Right-aligned source text */}
        <div className="text-right whitespace-nowrap">
          <p>Source: BBC Bangla</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;