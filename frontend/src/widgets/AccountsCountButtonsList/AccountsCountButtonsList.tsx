import { useEffect, useState } from "react";
import AccountsCountButton from "../../shared/ui/AccountsCountButton/AccountsCountButton";
import usePrice from "../../shared/store/usePrice";

const values = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

function AccountsCountButtonsList() {
  const [selectedValue, setSelectedValue] = useState(0);
  const { accounts, setAccounts } = usePrice();

  useEffect(() => {
    setSelectedValue(accounts / 10 - 1);
  }, [accounts]);

  return (
    <div className="flex justify-between">
      {values.map((count, i) => (
        <AccountsCountButton
          key={count}
          count={count}
          isSelected={selectedValue === i}
          onClick={() => {
            setSelectedValue(i);
            setAccounts(count);
          }}
        />
      ))}
    </div>
  );
}

export default AccountsCountButtonsList;
