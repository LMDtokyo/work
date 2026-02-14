import { useState } from "react";
import FastAnswerItemsList from "../FastAnswerItemsList/FastAnswerItemsList";
import { X } from "lucide-react";
import CreateFastAnswerModal from "../CreateFastAnswerModal/CreateFastAnswerModal";

interface IFastAnswerModal {
  setIsModalOpen: (value: boolean) => void;
}

function FastAnswersModal({ setIsModalOpen }: IFastAnswerModal) {
  const [inputValue, setInputValue] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 bg-chat-secondary-bg border border-chat-primary-border rounded-3xl py-7 pb-7 sm:pb-9 md:pb-11 px-4 sm:px-6 md:px-8 z-99 animate-fade-in-bottom w-full sm:w-150 overflow-auto max-h-100 ${isCreateModalOpen && "hidden"}`}
      >
        <h2 className="text-primary-font text-base sm:text-lg md:text-xl font-semibold">
          Быстрые ответы
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mb-3">
          <input
            type="text"
            className="w-full outline-none bg-chat-tertiary-bg focus:bg-chat-tertiary-bg-hover py-2 sm:py-3 px-5 text-sm sm:text-base rounded-full text-primary-font"
            placeholder="Поиск..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="text-primary-font w-full sm:w-auto text-sm sm:text-base bg-contrast rounded-full py-2 sm:py-3 px-6 cursor-pointer"
          >
            Добавить
          </button>
        </div>
        <FastAnswerItemsList
          items={[
            {
              title:
                "Lorem Ipsum is simply dummy sdfsfds sdf sfd sf dssf ssfsfdfsdfsfsdfs sf sdf sdfsfsd fsdf sfsdf sdf sdfsd",
              message:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
            },
            { title: "Какой то текст", message: "Какой то текст" },
            { title: "Какой то текст", message: "Какой то текст" },
            { title: "Какой то текст", message: "Какой то текст" },
            { title: "Какой то текст", message: "Какой то текст" },
            { title: "Какой то текст", message: "Какой то текст" },
            { title: "Какой то текст", message: "Какой то текст" },
            { title: "Какой то текст", message: "Какой то текст" },
            { title: "Какой то текст", message: "Какой то текст" },
            { title: "Какой то текст", message: "Какой то текст" },
            { title: "Какой то текст", message: "Какой то текст" },
            { title: "Какой то текст", message: "Какой то текст" },
          ]}
          searchValue={inputValue}
          isCreateModalOpen={isCreateModalOpen}
          setIsModalOpen={setIsModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
        />
        <X
          width={32}
          height={32}
          onClick={() => setIsModalOpen(false)}
          className="absolute right-3 sm:right-5 top-3 sm:top-5 text-secondary-font cursor-pointer rounded-full hover:bg-chat-tertiary-bg hover:text-primary-font p-1 duration-100"
        />
      </div>
      <div
        onClick={closeModal}
        className="fixed top-0 left-0 w-full h-full bg-[#00000080] z-40 animate-fade-in"
      />
      {isCreateModalOpen && (
        <CreateFastAnswerModal setIsModalOpen={setIsCreateModalOpen} />
      )}
    </>
  );
}

export default FastAnswersModal;
