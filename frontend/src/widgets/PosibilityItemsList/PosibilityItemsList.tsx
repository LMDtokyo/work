import PosibilityItem from "../../shared/ui/PosibilityItem/PosibilityItem";
import { items } from "./items";

function PosibilityItemsList() {
  return (
    <div className="flex justify-center gap-12">
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
