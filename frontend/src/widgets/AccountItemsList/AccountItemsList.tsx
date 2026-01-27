import AccountItem from "../../shared/ui/AccountItem/AccountItem";
import { useWbAccounts } from "../../shared/api/hooks/useWbAccounts";

interface AccountItemsListProps {
  limit?: number;
}

function AccountItemsList({ limit }: AccountItemsListProps) {
  const { data: accounts, isLoading } = useWbAccounts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-font-secondary">Загрузка...</p>
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-font-secondary">Нет подключённых аккаунтов</p>
      </div>
    );
  }

  const displayAccounts = limit ? accounts.slice(0, limit) : accounts;

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2 relative overflow-hidden">
      {displayAccounts.map((account) => (
        <AccountItem
          key={account.id}
          shopName={account.shopName}
          status={account.status}
          lastSyncAt={account.lastSyncAt}
        />
      ))}
    </div>
  );
}

export default AccountItemsList;
