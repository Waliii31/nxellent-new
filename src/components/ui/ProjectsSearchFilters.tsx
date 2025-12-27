import React from "react";
import SearchInput from "./SearchInput";
import DropdownPill from "./DropdownPill";

type Props = {
  search: string;
  onSearch: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
};

export default function ProjectsSearchFilters({
  search,
  onSearch,
  typeFilter,
  onTypeChange,
  statusFilter,
  onStatusChange,
}: Props): React.ReactElement {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      <SearchInput value={search} onChange={onSearch} />
      <div className="flex items-center gap-3">
        <DropdownPill
          label={`Type: ${typeFilter}`}
          options={["All", "Contract", "Application"]}
          onSelect={onTypeChange}
        />
        <DropdownPill
          label={`Status: ${statusFilter}`}
          options={["All", "Active", "Inactive"]}
          onSelect={onStatusChange}
        />
      </div>
    </div>
  );
}
