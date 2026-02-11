import { Plus } from "lucide-react";

interface IAddAccountButton {
  onClick: () => void;
}

function AddAccountButton({ onClick }: IAddAccountButton) {
  return (
    <button
      onClick={onClick}
      className="flex gap-2 bg-contrast rounded-md text-tertiary-font py-2 px-3 cursor-pointer"
    >
      <Plus />
      <span>Добавить</span>
    </button>
  );
}

export default AddAccountButton;
