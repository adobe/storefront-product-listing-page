type UserViewHistory = { sku: string; dateTime: string };

const getUserViewHistory = (): UserViewHistory[] => {
  const userViewHistory: { sku: string; date: string }[] | null =
    localStorage.getItem('ds-view-history-time-decay')
      ? JSON.parse(localStorage.getItem('ds-view-history-time-decay') as string)
      : null;

  if (Array.isArray(userViewHistory)) {
    return userViewHistory.slice(-200).map((v) => ({
      sku: v.sku,
      dateTime: v.date,
    }));
  }

  return [];
};

export { getUserViewHistory };
