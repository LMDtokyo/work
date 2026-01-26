import { useEffect, useState } from "react";
import cx from "classix";
import usePrice from "../../store/usePrice";

interface IAccountSlider {
  className?: string;
}

const prices = [1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900, 4200];

function AccountSlider({ className }: IAccountSlider) {
  const [value, setValue] = useState(50);
  const {
    accounts,
    price,
    setAccounts,
    setPrice,
    setOneAccountPrice,
    setEconomyPercentage,
  } = usePrice();

  useEffect(() => {
    const newOneAccountPrice = Math.floor(price / accounts);
    const newEconomyPercentage = Math.floor(100 - newOneAccountPrice / 1.5);

    setValue(accounts);
    setPrice(prices[accounts / 10 - 1]);
    setEconomyPercentage(newEconomyPercentage);
    setOneAccountPrice(newOneAccountPrice);
  }, [accounts, price]);

  const cls = cx(
    `
    w-full 
    h-3 
    bg-bg-contrast-20 
    rounded-lg 
    appearance-none 
    cursor-pointer
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:h-6
    [&::-webkit-slider-thumb]:w-6
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:bg-button-gradient-start
    [&::-moz-range-thumb]:h-6
    [&::-moz-range-thumb]:w-6
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:bg-button-gradient-start
  `,
    className,
  );

  return (
    <input
      type="range"
      min="10"
      max="100"
      value={value}
      step="10"
      onChange={(e) => {
        setValue(Number(e.target.value));
        setAccounts(Number(e.target.value));
      }}
      className={cls}
    />
  );
}

export default AccountSlider;
