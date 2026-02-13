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
    <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] min-[400px]:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 relative w-full overflow-hidden">
      {data.map((item) => (
        <SubscribeItem
          key={item.title}
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
