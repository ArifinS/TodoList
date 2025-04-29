import React from "react";

interface SearchStreamProps {
  searchTerm: string; 
  setSearchTerm: (value: string) => void; 
}
const SearchStream: React.FC<SearchStreamProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative rounded-lg   text-gray-50 md:min-w-[380px] lg:min-w-[440px] ">
      <input
        type="search"
        className="z-20 block w-full bg-[#2D333F] px-4 py-2.5 pr-10 text-white border border-gray-600  outline-none transition-all duration-200"
        placeholder="Search by title or description"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchStream;