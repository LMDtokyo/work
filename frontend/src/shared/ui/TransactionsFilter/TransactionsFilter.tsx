import { ArrowDownWideNarrow, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const filterItems = ["Все", "Доходы", "Расходы", "Возвраты"];

function TransactionsFilter() {
  const [isOpened, setIsOpened] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpened(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpened(!isOpened)}
        className="inline-flex justify-center items-center gap-3 py-2 px-3 bg-chat-tertiary-bg rounded-md text-font-primary cursor-pointer"
      >
        <ArrowDownWideNarrow />
        <span className="font-semibold select-none">
          {filterItems[selectedItem]}
        </span>
        <ChevronDown />
      </div>
      {isOpened && (
        <div
          className={`flex flex-col gap-1 bg-chat-tertiary-bg absolute top-12 right-0 text-font-primary rounded-md z-50 p-1 w-30 ${isOpened && "animate-fade-in-bottom"}`}
        >
          {filterItems.map((item, i) => (
            <button
              key={item}
              onClick={() => {
                setSelectedItem(i);
                setIsOpened(false);
              }}
              className={`flex justify-between gap-2 py-2 px-3 cursor-pointer rounded-sm hover:bg-chat-tertiary-bg-hover duration-100 ${selectedItem === i && "bg-chat-tertiary-bg-hover"}`}
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
