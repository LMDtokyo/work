import PosibilityAdditionItem from "../../shared/ui/PosibilityAdditionItem/PosibilityAdditionItem";
import PosibilityDescription from "../../shared/ui/PosibilityDescription/PosibilityDescription";
import { useState } from "react";
import { descItems, items } from "./data";

function PosibilitiesAdditionSection() {
  const [selectedItem, setSelectedItem] = useState(0);

  return (
    <div className="flex items-center justify-center gap-20 mt-20 z-99">
      <div className="flex flex-col gap-6">
        {items.map((item, i) => (
          <div className="flex flex-col gap-12 items-center">
            <PosibilityAdditionItem
              key={item.title}
              icon={<item.Icon width={28} height={28} />}
              title={item.title}
              desc={item.desc}
              onClick={() => setSelectedItem(i)}
              isSelected={i === selectedItem}
            />
            {selectedItem === i && (
              <PosibilityDescription
                title={descItems[selectedItem].title}
                desc={descItems[selectedItem].desc}
                className="flex lg:hidden mb-12"
              />
            )}
          </div>
        ))}
      </div>
      <PosibilityDescription
        title={descItems[selectedItem].title}
        desc={descItems[selectedItem].desc}
        className="hidden lg:flex"
      />
    </div>
  );
}

export default PosibilitiesAdditionSection;
