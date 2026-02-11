import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

function Searchbar({ value, onChange }: Props) {
  return (
    <div className="relative w-full animate-fade-in-bottom">
      <Search className="text-secondary-font absolute top-2.5 md:top-3 left-5 w-5 h-5 md:w-7 md:h-7" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-chat-secondary-bg px-5 py-2 md:py-3 pl-13 md:pl-15 w-full rounded-lg placeholder:text-secondary-font outline-none text-primary-font focus:bg-chat-tertiary-bg focus:shadow-[0_2px_4px_#00000025] duration-150 text"
        placeholder="Поиск..."
      />
    </div>
  );
}

export default Searchbar;
