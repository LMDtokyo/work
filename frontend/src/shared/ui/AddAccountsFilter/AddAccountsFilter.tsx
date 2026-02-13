import { useRef, useState } from "react";
import { useClickOutside } from "../../hooks";
import { ChevronDown } from "lucide-react";
import WildberriesIcon from "../../assets/WildberriesIcon";
import AvitoIcon from "../../assets/AvitoIcon";
import TelegramIcon from "../../assets/TelegramIcon";
import usePrice from "../../store/usePrice";

interface IFilterItems {
  Icon: React.ReactNode;
  title: string;
}

const filterItems: IFilterItems[] = [
  {
    Icon: <WildberriesIcon width={32} height={32} className="rounded-full" />,
    title: "Wildberries",
  },
  {
    Icon: <AvitoIcon width={32} height={32} className="rounded-full" />,
    title: "Avito",
  },
  {
    Icon: <TelegramIcon width={32} height={32} className="rounded-full" />,
    title: "Telegram",
  },
];

function AddAccountFilter() {
  const [isOpened, setIsOpened] = useState(false);
  const [selected, setSelected] = useState(0);
  const { setPlatform } = usePrice();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpened(false), isOpened);

  return (
    <div className="flex flex-col relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpened(!isOpened)}
        className="inline-flex justify-between items-center gap-3 py-1 sm:py-1.5 px-1 sm:px-1.5 pr-3 bg-chat-tertiary-bg rounded-full text-primary-font cursor-pointer border border-chat-secondary-border hover:bg-chat-tertiary-bg-hover duration-100"
      >
        <div className="flex gap-3 items-center">
          {filterItems[selected].Icon}
          <span className="font-semibold select-none text-sm md:text-[16px]">
            {filterItems[selected].title}
          </span>
        </div>
        <ChevronDown
          className={`w-5 md:w-6 ${isOpened && "rotate-180"} duration-150`}
        />
      </div>
      {isOpened && (
        <div
          className={`flex flex-col gap-1 bg-chat-tertiary-bg absolute top-13 right-0 text-primary-font border border-chat-secondary-border rounded-3xl z-50 p-1 w-auto ${isOpened && "animate-fade-in-bottom"}`}
        >
          {filterItems.map((item, i) => (
            <button
              key={item.title}
              onClick={() => {
                setPlatform(item.title);
                setIsOpened(false);
                setSelected(i);
              }}
              className={`flex items-center gap-2 py-1.5 px-1.5 pr-5 cursor-pointer rounded-full hover:bg-chat-tertiary-bg-hover duration-100 ${selected === i && "bg-chat-tertiary-bg-hover"}`}
            >
              <span>{item.Icon}</span>
              <span className="select-none text-center">{item.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddAccountFilter;
