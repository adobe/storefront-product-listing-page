import { StoreDetailsProps } from '../../context';
import {
  sanitizeString,
  validateStoreDetailsKeys,
} from '../validateStoreDetails';
describe('should sanitize string', () => {
  test('should remove special characters', () => {
    const unsanitizedStr1 = sanitizeString(
      'hello<script>hello</script><div>hello</div>'
    );
    const unsanitizedStr2 = sanitizeString('<script>hello</script>');
    const expectedStr1 = 'helloscripthelloscriptdivhellodiv';
    const expectedStr2 = 'scripthelloscript';

    expect(unsanitizedStr1).toEqual(expectedStr1);
    expect(unsanitizedStr2).toEqual(expectedStr2);
  });
  test('valid string should not change', () => {
    const validStr1 = sanitizeString('storefront-catalog-apollo');
    const validStr2 = sanitizeString('12,24,36');
    const validStr3 = sanitizeString('main_website_store');
    const validStr4 = sanitizeString('b6589fc6ab0dc82cf1');
    const expectedStr1 = 'storefront-catalog-apollo';
    const expectedStr2 = '12,24,36';
    const expectedStr3 = 'main_website_store';
    const expectedStr4 = 'b6589fc6ab0dc82cf1';

    expect(validStr1).toEqual(expectedStr1);
    expect(validStr2).toEqual(expectedStr2);
    expect(validStr3).toEqual(expectedStr3);
    expect(validStr4).toEqual(expectedStr4);
  });
});

describe('test validating storeDetails.', () => {
  test('valid storeDetails should remain unchanged', () => {
    const storeDetails = {
      environmentId: '22500baf-135e-4b8f-8f18-14276de7d356',
      websiteCode: 'base',
      storeCode: 'main_website_store',
      storeViewCode: 'default',
      config: {
        minQueryLength: '2',
        pageSize: 8,
        perPageConfig: {
          pageSizeOptions: '12,24,36',
          defaultPageSizeOption: '24',
        },
        currencySymbol: '$',
        currencyRate: '1',
        displaySearchBox: true,
        displayOutOfStock: true,
        allowAllProducts: false,
        optimizeImages: true,
        imageBaseWidth: 200,
      },
      context: {
        customerGroup: 'b6589fc6ab0dc82cf12099d1c2d40ab994e8410c',
      },
      apiKey: 'storefront-catalog-apollo',
      apiUrl: '',
      environmentType: '',
    } as StoreDetailsProps;
    const expectedStoreDetails = JSON.parse(JSON.stringify(storeDetails));

    expect(validateStoreDetailsKeys(storeDetails)).toEqual(
      expectedStoreDetails
    );
  });
  test('invalid storeDetails should remove unknown keys', () => {
    const invalidStoreDetails = {
      environmentId: '22500baf-135e-4b8f-8f18-14276de7d356',
      websiteCode: 'base',
      storeCode: 'main_website_store',
      storeViewCode: 'default',
      config: {
        minQueryLength: '2',
        pageSize: 8,
        perPageConfig: {
          pageSizeOptions: '12,24,36',
          defaultPageSizeOption: '24',
        },
        currencySymbol: '$',
        currencyRate: '1',
        displaySearchBox: true,
        displayOutOfStock: true,
        allowAllProducts: false,
        optimizeImages: true,
        imageBaseWidth: 200,
      },
      context: {
        customerGroup: 'b6589fc6ab0dc82cf12099d1c2d40ab994e8410c',
      },
      apiKey: 'storefront-catalog-apollo',
      apiUrl: '',
      environmentType: '',
      shouldGetRemoved: 'should not belong here',
    } as StoreDetailsProps;
    const expectedStoreDetails = {
      environmentId: '22500baf-135e-4b8f-8f18-14276de7d356',
      websiteCode: 'base',
      storeCode: 'main_website_store',
      storeViewCode: 'default',
      config: {
        minQueryLength: '2',
        pageSize: 8,
        perPageConfig: {
          pageSizeOptions: '12,24,36',
          defaultPageSizeOption: '24',
        },
        currencySymbol: '$',
        currencyRate: '1',
        displaySearchBox: true,
        displayOutOfStock: true,
        allowAllProducts: false,
        optimizeImages: true,
        imageBaseWidth: 200,
      },
      context: {
        customerGroup: 'b6589fc6ab0dc82cf12099d1c2d40ab994e8410c',
      },
      apiKey: 'storefront-catalog-apollo',
      apiUrl: '',
      environmentType: '',
    } as StoreDetailsProps;

    expect(validateStoreDetailsKeys(invalidStoreDetails)).toEqual(
      expectedStoreDetails
    );
  });
});
