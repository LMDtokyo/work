import usePeriod from "../../store/usePeriod";

function PeriodSwitcher() {
    const {period, setPeriod} = usePeriod();

    return (
        <div className="bg-chat-tertiary-bg rounded-full border border-secondary-border p-0.5">
            <button onClick={() => setPeriod("month")} className={`py-1 px-4 rounded-full text-font-primary w-30 cursor-pointer ${period === "month" ? "bg-chat-tertiary-bg-hover" : "bg-transparent"}`}>Месяц</button>
            <button onClick={() => setPeriod("year")} className={`py-1 px-4 rounded-full text-font-primary w-30 cursor-pointer ${period === "year" ? "bg-chat-tertiary-bg-hover" : "bg-transparent"}`}>Год</button>
        </div>
    )
}

export default PeriodSwitcher;