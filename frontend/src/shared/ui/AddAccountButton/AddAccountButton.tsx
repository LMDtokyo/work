import { Plus } from "lucide-react";

interface IAddAccountButton {
  onClick: () => void;
}

function AddAccountButton({ onClick }: IAddAccountButton) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 bg-contrast rounded-full hover:scale-102 duration-100 text-tertiary-font py-2 px-3 cursor-pointer"
    >
      <Plus className="w-4 sm:w-5 md:w-6" />
      <span className="text-sm sm:text-base">Добавить</span>
    </button>
  );
}

export default AddAccountButton;
