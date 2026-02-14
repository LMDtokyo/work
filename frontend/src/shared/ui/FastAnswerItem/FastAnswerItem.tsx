import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  SquarePen,
  Trash,
} from "lucide-react";
import { useState } from "react";
import useFastMessage from "../../store/useFastMessage";
import CreateFastAnswerModal from "../../../widgets/CreateFastAnswerModal/CreateFastAnswerModal";

export interface IFastAnswerItem {
  title: string;
  message: string;
  isCreateModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  setIsCreateModalOpen: (value: boolean) => void;
}

function FastAnswerItem({
  title,
  message,
  isCreateModalOpen,
  setIsModalOpen,
  setIsCreateModalOpen,
}: IFastAnswerItem) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const setMessage = useFastMessage((state) => state.setMessage);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center text-primary-font">
          <ChevronDown
            width={20}
            height={20}
            className={`cursor-pointer duration-100 text-secondary-font hover:text-primary-font ${isOpen && "rotate-180"}`}
            onClick={() => setIsOpen(!isOpen)}
          />
          <h3
            className={`font-semibold text-xs sm:text-sm md:text-base truncate text-ellipsis max-w-25 min-[400px]:max-w-45 min-[550px]:max-w-60 sm:max-w-70 ${isOpen && "text-secondary-font"}`}
          >
            {title}
          </h3>
        </div>
        <div className="flex gap-3 items-center justify-center text-secondary-font">
          <Trash
            width={20}
            height={20}
            onClick={() => {
              /* TODO */
            }}
            className="text-red-bg/80 hover:text-red-bg cursor-pointer w-4 h-4 sm:w-5 sm:h-5"
          />
          <SquarePen
            width={20}
            height={20}
            className="cursor-pointer hover:text-primary-font duration-100 w-4 h-4 sm:w-5 sm:h-5"
            onClick={() => setIsCreateModalOpen(true)}
          />
          {copied ? (
            <Check
              width={20}
              height={20}
              className="cursor-pointer text-primary-font w-4 h-4 sm:w-5 sm:h-5"
            />
          ) : (
            <Copy
              width={20}
              height={20}
              onClick={handleCopy}
              className="cursor-pointer hover:text-primary-font duration-100 w-4 h-4 sm:w-5 sm:h-5"
            />
          )}
          <span
            onClick={() => {
              setMessage(message);
              setIsModalOpen(false);
            }}
            className="p-2 rounded-full bg-contrast cursor-pointer group text-primary-font"
          >
            <ArrowRight
              width={20}
              height={20}
              className="group-hover:scale-110 duration-150 w-4 h-4 sm:w-5 sm:h-5"
            />
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="px-7 pb-3 animate-fade-in-right">
          <p className="text-primary-font text-xs sm:text-sm md:text-base">
            {message}
          </p>
        </div>
      )}
      {isCreateModalOpen && (
        <CreateFastAnswerModal setIsModalOpen={setIsCreateModalOpen} />
      )}
    </div>
  );
}

export default FastAnswerItem;
