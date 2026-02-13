import usePrice from "../../store/usePrice";

function AddAccountsInfo() {
  const { accounts, price } = usePrice();

  return (
    <div className="flex items-center justify-center bg-chat-tertiary-bg border border-chat-secondary-border min-w-40 w-auto rounded-full px-5 py-2 font-semibold">
      <h3 className="text-primary-font text-sm sm:text-base h-full border-r border-chat-secondary-border flex items-center justify-center gap-1 w-full pr-4">
        {accounts} <span className="text-secondary-font">акк.</span>
      </h3>
      <h3 className="text-primary-font h-full text-sm sm:text-base flex items-center justify-center gap-1 w-full pl-4">
        {price}
        <span className="text-secondary-font">₽</span>
      </h3>
    </div>
  );
}

export default AddAccountsInfo;
