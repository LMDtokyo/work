import PosibilityItem from "../../shared/ui/PosibilityItem/PosibilityItem";
import { items } from "./items";

function PosibilityItemsList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 w-full max-w-[1430px] px-2 md:px-0">
      {items.map((item) => (
        <PosibilityItem
          key={item.title}
          icon={<item.Icon />}
          title={item.title}
          description={item.description}
          className="z-99"
        />
      ))}
    </div>
  );
}

export default PosibilityItemsList;
