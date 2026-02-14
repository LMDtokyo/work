import { useEffect, useState } from "react";
import FastAnswerItem from "../../shared/ui/FastAnswerItem/FastAnswerItem";

interface IFastAnswerItem {
  title: string;
  message: string;
}

interface IFastAnswerItemsList {
  items: IFastAnswerItem[];
  searchValue: string;
  isCreateModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  setIsCreateModalOpen: (value: boolean) => void;
}

function FastAnswerItemsList({
  items,
  searchValue,
  isCreateModalOpen,
  setIsModalOpen,
  setIsCreateModalOpen,
}: IFastAnswerItemsList) {
  const [filteredItems, setFilteredItems] = useState<IFastAnswerItem[]>([]);

  useEffect(() => {
    if (searchValue) {
      const filtered = items.filter(
        (item) =>
          item.title
            .toLowerCase()
            .startsWith(searchValue.toLowerCase().trim()) ||
          item.title.toLowerCase().includes(searchValue.toLowerCase().trim()),
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchValue]);

  if (searchValue && filteredItems.length === 0) {
    return (
      <div className="w-full text-center text-secondary-font">
        Ничего не найдено
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full text-center text-secondary-font">
        Пока что шаблонов нет
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {filteredItems.map((item) => (
        <FastAnswerItem
          key={item.message}
          title={item.title}
          message={item.message}
          isCreateModalOpen={isCreateModalOpen}
          setIsModalOpen={setIsModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
        />
      ))}
    </div>
  );
}

export default FastAnswerItemsList;
