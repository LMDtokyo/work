import { ChevronRight } from "lucide-react";

interface IAccountCategoryButton {
  icon: React.ReactNode;
  title: string;
  accounts: number;
  onClick: () => void;
}

function AccountCategoryButton({
  icon,
  title,
  accounts = 0,
  onClick,
}: IAccountCategoryButton) {
  return (
    <button
      onClick={onClick}
      className="flex justify-between items-center group text-primary-font bg-chat-tertiary-bg rounded-xl border border-chat-secondary-border p-2 pr-5 w-full cursor-pointer hover:bg-chat-tertiary-bg-hover duration-50"
    >
      <div className="flex gap-4">
        <span>{icon}</span>
        <div className="flex flex-col items-start gap-0.5">
          <h2 className="font-semibold">{title}</h2>
          <p className="text-secondary-font text-sm">{accounts} аккаунтов</p>
        </div>
      </div>
      <ChevronRight className="group-hover:translate-x-1 duration-100" />
    </button>
  );
}

export default AccountCategoryButton;
