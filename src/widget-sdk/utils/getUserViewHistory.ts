type UserViewHistory = { sku: string; dateTime: string };

const getUserViewHistory = (): UserViewHistory[] => {
    const userViewHistory: { sku: string; date: string }[] | null =
        localStorage.getItem("ds-view-history-time-decay")
            ? JSON.parse(
                  localStorage.getItem("ds-view-history-time-decay") as string,
              )
            : null;

    if (Array.isArray(userViewHistory)) {
        // https://git.corp.adobe.com/magento-datalake/magento2-snowplow-js/blob/main/src/utils.js#L177
        // this shows localStorage is guaranteed sorted by unique by most recent timestamp as last index.

        // MSRCH-2740: send the top 200 most recently viewed unique SKUs
        return userViewHistory.slice(-200).map(v => ({
            sku: v.sku,
            dateTime: v.date,
        }));
    }

    return [];
};

export { getUserViewHistory };
