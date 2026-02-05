import usePeriod from "../../shared/store/usePeriod";
import SubscribeItem from "../../shared/ui/SubscribeItem/SubscribeItem";
import { dataMonth, dataYear } from "./data";

function SubscribeItemsList() {
    const period = usePeriod((state) => state.period);
    const data = period === "month" ? dataMonth : dataYear;

  return (
    <div className="flex gap-7 w-full items-center justify-center animate-fade-in-bottom">
      {data.map((item) => (
        <SubscribeItem
          type={item.type}
          title={item.title}
          price={item.price}
          accounts={item.accounts}
          advantages={item.advantages}
        />
      ))}
    </div>
  );
}

export default SubscribeItemsList;
