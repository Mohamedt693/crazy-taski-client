import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}


function SearchInput({ value, onChange, placeholder = "Search..." }: SearchInputProps) {
  return (
    <div className="relative flex-1 max-w-md">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />
      <input
        name="search"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-(--input-bg) border text-(--primary-text) border-black/5 rounded-2xl py-3.5 pl-12 pr-4 
        text-sm outline-none focus:border-[#7DAEF7] focus:ring-4 focus:ring-[#7DAEF7]/5 
        transition-all shadow-sm"
      />
    </div>
  )
}

export default SearchInput;
