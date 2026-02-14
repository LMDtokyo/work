import { Asterisk, Check } from "lucide-react";
import { useState } from "react";
import PrimaryInput from "../../shared/ui/PrimaryInput/PrimaryInput";

function PromocodeSection() {
  const [promo, setPromo] = useState("");

  return (
    <div className="bg-chat-secondary-bg border border-chat-primary-border rounded-2xl py-4 px-4 md:py-5 md:px-8 w-full animate-fade-in-bottom">
      <div className="flex items-start sm:items-center gap-4 mb-5">
        <span className="p-2 sm:p-2.5 bg-chat-tertiary-bg/80 rounded-lg text-primary-font border border-chat-secondary-border">
          <Asterisk width={20} />
        </span>
        <div>
          <h2 className="text-base sm:text-lg md:text-xl text-primary-font font-semibold">
            Промокод
          </h2>
          <p className="text-secondary-font text-xs sm:text-sm md:text-basic">
            Поделитесь им с друзьями и получайте бонусы
          </p>
        </div>
      </div>
      <div className="relative cursor-pointer">
        <PrimaryInput
          value={promo}
          onChange={(e) => setPromo(e.target.value)}
          placeholder="Введите ваш промокод..."
        />
        {/* TODO onClick */}
        <Check className="absolute top-4 sm:top-5 right-5 text-primary-font w-4 sm:w-5 cursor-pointer hover:scale-110 duration-100" />
      </div>
    </div>
  );
}

export default PromocodeSection;
