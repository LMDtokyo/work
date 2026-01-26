interface IAccountsCountButton {
  count: number;
  isSelected: boolean;
  onClick?: () => void;
}

function AccountsCountButton({
  count,
  isSelected,
  onClick,
}: IAccountsCountButton) {
  return (
    <button
      onClick={onClick}
      className={`text-font-primary font-bold text-2xl py-4 px-8 rounded-lg hover:bg-font-contrast hover:text-font-tertiary duration-150 cursor-pointer ${isSelected ? "bg-linear-to-r from-button-gradient-start to-button-gradient-end text-font-tertiary" : "bg-bg-contrast-20"}`}
    >
      {count}
    </button>
  );
}

export default AccountsCountButton;
