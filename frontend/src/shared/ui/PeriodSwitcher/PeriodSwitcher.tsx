import usePeriod from "../../store/usePeriod";

function PeriodSwitcher() {
  const { period, setPeriod } = usePeriod();

  return (
    <div className="bg-chat-tertiary-bg rounded-full w-full md:w-auto border border-chat-secondary-border p-0.5">
      <button
        onClick={() => setPeriod("month")}
        className={`py-1 rounded-full w-[50%] md:w-28 text-primary-font text-sm sm:text-base cursor-pointer duration-100 ${period === "month" ? "bg-chat-tertiary-bg-hover" : "bg-transparent"}`}
      >
        Месяц
      </button>
      <button
        onClick={() => setPeriod("year")}
        className={`py-1 rounded-full text-primary-font text-sm sm:text-base w-[50%] md:w-28 cursor-pointer duration-100 ${period === "year" ? "bg-chat-tertiary-bg-hover" : "bg-transparent"}`}
      >
        Год
      </button>
    </div>
  );
}

export default PeriodSwitcher;
