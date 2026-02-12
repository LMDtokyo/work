import { Asterisk, Check, Copy } from "lucide-react";
import { useState } from "react";

function PromocodeSection() {
  const [copied, setCopied] = useState(false);
  const promo = "asdfja;slkfj;aslkfjaf;jasldfj;afkj";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promo);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="bg-chat-secondary-bg border border-chat-primary-border rounded-2xl p-5 w-full animate-fade-in-bottom">
      <div className="flex items-center gap-4 mb-5">
        <span className="p-2.5 bg-chat-tertiary-bg/80 rounded-lg text-primary-font border border-chat-secondary-border">
          <Asterisk width={20} />
        </span>
        <div>
          <h2 className="text-lg md:text-xl text-primary-font font-semibold">
            Промокод
          </h2>
          <p className="text-secondary-font text-sm md:text-basic">
            Поделитесь им с друзьями и получайте бонусы
          </p>
        </div>
      </div>
      <div className="relative group cursor-pointer" onClick={handleCopy}>
        <div className="w-full rounded-full bg-chat-tertiary-bg py-3 px-5 pr-15 text-primary-font truncate overflow-hidden whitespace-nowrap text-ellipsis shadow-[0_2px_4px_#00000025] group hover:text-primary-font/80 duration-100">
          {promo}
        </div>
        {copied ? (
          <Check className="absolute top-3 right-5 group-hover:scale-108 duration-150 text-primary-font w-5" />
        ) : (
          <Copy className="absolute top-3 right-5 group-hover:scale-108 duration-150 text-primary-font w-5" />
        )}
      </div>
    </div>
  );
}

export default PromocodeSection;
