import usePeriod from "../../shared/store/usePeriod";
import SubscribeItem from "../../shared/ui/SubscribeItem/SubscribeItem";
import { dataMonth, dataYear } from "./data";

interface ISubscribeItemsList {
  color: string;
}

function SubscribeItemsList({ color }: ISubscribeItemsList) {
  const period = usePeriod((state) => state.period);
  const data = period === "month" ? dataMonth : dataYear;

  return (
    <div className="flex flex-wrap gap-7 w-full justify-center animate-fade-in-bottom">
      {data.map((item) => (
        <SubscribeItem
          type={item.type}
          title={item.title}
          price={item.price}
          accounts={item.accounts}
          advantages={item.advantages}
          color={color}
        />
      ))}
    </div>
  );
}

export default SubscribeItemsList;
