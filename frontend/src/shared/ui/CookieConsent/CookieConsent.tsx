import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { getCookie, setCookie } from "../../utils/cookies";

const CONSENT_KEY = "cookie_consent";

function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const consent = getCookie(CONSENT_KEY);
    if (!consent) {
      setVisible(true);
      requestAnimationFrame(() => setMounted(true));
    }
  }, []);

  const handleClose = useCallback((accepted: boolean) => {
    setCookie(CONSENT_KEY, accepted ? "accepted" : "declined");
    setMounted(false);
    setTimeout(() => setVisible(false), 300);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-99 p-4 transition-all duration-300 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="max-w-4xl mx-auto bg-chat-secondary-bg border border-chat-primary-border rounded-2xl shadow-lg overflow-hidden">
        <div className="p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="text-primary-font font-semibold text-base mb-2">
                  Мы используем cookies
                </h3>
                <p className="text-secondary-font text-sm leading-relaxed">
                  Для обеспечения работы сервиса и авторизации мы используем
                  файлы cookie. Продолжая использовать сайт, вы соглашаетесь с{" "}
                  <a
                    href="/privacy-policy"
                    className="text-contrast hover:text-contrast-hover underline transition-colors"
                  >
                    политикой конфиденциальности
                  </a>
                  .
                </p>
              </div>
              <button
                onClick={() => handleClose(false)}
                className="text-secondary-font hover:text-primary-font transition-colors p-1 md:hidden"
                aria-label="Закрыть"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => handleClose(false)}
              className="hidden md:block px-5 py-2.5 text-primary-font text-sm font-medium border border-chat-primary-border rounded-full hover:bg-chat-tertiary-bg-hover transition-colors cursor-pointer"
            >
              Отклонить
            </button>
            <button
              onClick={() => handleClose(true)}
              className="flex-1 md:flex-none px-6 py-2.5 bg-contrast text-tertiary-font text-sm font-semibold rounded-full transition-shadow cursor-pointer"
            >
              Принять
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
