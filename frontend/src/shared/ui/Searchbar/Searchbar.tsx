import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

function Searchbar({ value, onChange }: Props) {
  return (
    <div className="relative w-full animate-fade-in-bottom">
      <Search className="text-font-secondary absolute top-3 left-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-chat-secondary-bg px-5 py-3 pl-15 w-full rounded-lg placeholder:text-font-secondary outline-none text-font-primary focus:bg-chat-selected-bg focus:shadow-[0_2px_4px_#00000025] duration-150 text"
        placeholder="Поиск..."
      />
    </div>
  );
}

export default Searchbar;
