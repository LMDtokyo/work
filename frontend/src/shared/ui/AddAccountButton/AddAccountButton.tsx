import { Plus } from "lucide-react";

interface IAddAccountButton {
  onClick: () => void;
}

function AddAccountButton({ onClick }: IAddAccountButton) {
  return (
    <button
      onClick={onClick}
      className="flex gap-2 bg-linear-to-b from-button-gradient-start to-button-gradient-end rounded-md text-font-tertiary py-2 px-3 cursor-pointer"
    >
      <Plus />
      <span>Добавить</span>
    </button>
  );
}

export default AddAccountButton;
