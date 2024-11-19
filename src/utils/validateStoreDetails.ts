import { StoreDetailsProps } from '../context';

const validStoreDetailsKeys: Array<keyof StoreDetailsProps> = [
  'environmentId',
  'environmentType',
  'websiteCode',
  'storeCode',
  'storeViewCode',
  'config',
  'context',
  'apiUrl',
  'apiKey',
  'route',
  'searchQuery',
  'inGridPromoIndexes',
];

export const sanitizeString = (value: any) => {
  // just incase, https://stackoverflow.com/a/23453651
  if (typeof value === 'string') {
    // eslint-disable-next-line no-useless-escape
    value = value.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, '');
    return value.trim();
  }
  return value;
};

export const validateStoreDetailsKeys = (
  storeDetails: StoreDetailsProps
): StoreDetailsProps => {
  Object.keys(storeDetails).forEach((key: string) => {
    if (!validStoreDetailsKeys.includes(key as keyof StoreDetailsProps)) {
      // eslint-disable-next-line no-console
      console.error(`Invalid key ${key} in StoreDetailsProps`);
      // filter out invalid keys/value
      delete (storeDetails as any)[key];
      return;
    }
    (storeDetails as any)[key] = sanitizeString((storeDetails as any)[key]);
  });
  return storeDetails;
};
