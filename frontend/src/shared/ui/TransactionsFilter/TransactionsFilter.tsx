import { ArrowDownWideNarrow, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { useClickOutside } from "../../hooks";

const filterItems = ["Все", "Доходы", "В процессе", "Отмены"];

interface Props {
  selected: number;
  onChange: (idx: number) => void;
}

function TransactionsFilter({ selected, onChange }: Props) {
  const [isOpened, setIsOpened] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpened(false), isOpened);

  return (
    <div className="flex flex-col relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpened(!isOpened)}
        className="inline-flex justify-center items-center gap-3 py-2 px-3 bg-chat-tertiary-bg rounded-md text-primary-font cursor-pointer"
      >
        <ArrowDownWideNarrow className="w-5 md:w-6" />
        <span className="font-semibold select-none text-sm md:text-[16px]">
          {filterItems[selected]}
        </span>
        <ChevronDown className="w-5 md:w-6" />
      </div>
      {isOpened && (
        <div
          className={`flex flex-col gap-1 bg-chat-tertiary-bg absolute top-12 right-0 text-primary-font rounded-md z-50 p-1 w-30 ${isOpened && "animate-fade-in-bottom"}`}
        >
          {filterItems.map((item, i) => (
            <button
              key={item}
              onClick={() => {
                onChange(i);
                setIsOpened(false);
              }}
              className={`flex justify-between gap-2 py-2 px-3 cursor-pointer rounded-sm hover:bg-chat-tertiary-bg-hover duration-100 ${selected === i && "bg-chat-tertiary-bg-hover"}`}
            >
              <span className="select-none text-center">{item}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionsFilter;
