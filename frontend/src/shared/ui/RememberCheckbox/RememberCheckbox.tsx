import { Check } from "lucide-react";

interface RememberCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function RememberCheckbox({ checked, onChange }: RememberCheckboxProps) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="hidden"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`w-4 h-4 border-2 rounded-sm transition-all duration-200
          ${checked ? "bg-contrast border-contrast" : "border-contrast"}`}
        >
          {checked && (
            <Check
              strokeWidth={3}
              className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
          )}
        </div>
      </div>
      <span className="text-primary-font select-none text-sm">
        Запомнить меня
      </span>
    </label>
  );
}

export default RememberCheckbox;
