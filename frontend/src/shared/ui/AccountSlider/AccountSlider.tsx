import { useEffect, useState } from "react";
import usePrice from "../../store/usePrice";

function AccountSlider() {
  const [value, setValue] = useState(1);
  const { accounts, setPrice, setAccounts } = usePrice();
  const min = 1;
  const max = 100;

  const percentage = ((value - min) / (max - min)) * 100;

  useEffect(() => {
    setValue(accounts)
  }, [])

  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 text-right">{min}</span>

        <div className="relative w-full group">
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-chat-tertiary-bg rounded-full" />

          <div
            className="absolute top-1/2 -translate-y-1/2 h-2 bg-track-active-color rounded-full"
            style={{ width: `${percentage}%` }}
          />

          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => {
              setValue(Number(e.target.value));
              setAccounts(Number(e.target.value));
              setPrice(Number(e.target.value) * 100);
            }}
            className="relative w-full appearance-none bg-transparent z-10 top-0.5 cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5
                      [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-white
                      [&::-webkit-slider-thumb]:border-3
                      [&::-webkit-slider-thumb]:border-track-active-color
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:w-5
                      [&::-moz-range-thumb]:h-5
                      [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:bg-white
                      [&::-moz-range-thumb]:border-3
                    [&::-moz-range-thumb]:border-track-active-color
                      [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>

        <span className="text-sm text-gray-500 w-6 text-right">{max}</span>
      </div>
    </div>
  );
}

export default AccountSlider;
