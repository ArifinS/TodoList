import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface GroupingDropdownProps {
  groupBy: string;
  setGroupBy: (value: string) => void;
}

const Gropingdropdown: React.FC<GroupingDropdownProps> = ({ groupBy, setGroupBy }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Button
        variant="outline"
        className="bg-[#2D333F] text-white border-gray-600 hover:bg-gray-700  hover:text-white h-9 px-6 py-6 rounded-0"
      >
        Group by: {groupBy === "None" ? "None" : groupBy}
      </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#2D333F] text-white border-gray-600 ">
        <DropdownMenuLabel>Group By</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600 hover:text-white" />
        {["None", "Tags", "Priority", "Favorites"].map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => setGroupBy(option)}
            className="hover:bg-gray-700 focus:bg-gray-700 hover:text-white"
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Gropingdropdown;