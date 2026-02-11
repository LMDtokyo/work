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
      className={`text-primary-font font-bold text-base sm:text-lg md:text-xl lg:text-2xl py-2 sm:py-3 md:py-4 px-4 sm:px-5 md:px-6 lg:px-8 rounded-lg hover:bg-contrast hover:text-tertiary-font duration-150 cursor-pointer shrink-0 ${isSelected ? "bg-linear-to-r from-button-gradient-start to-button-gradient-end text-tertiary-font" : "bg-bg-contrast-20"}`}
    >
      {count}
    </button>
  );
}

export default AccountsCountButton;
