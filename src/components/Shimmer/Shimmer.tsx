/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import {useProducts, useSensor, useStore} from 'src/context';

import ButtonShimmer from '../ButtonShimmer';
import FacetsShimmer from '../FacetsShimmer';
import ProductCardShimmer from '../ProductCardShimmer';
import {DEFAULT_PAGE_SIZE} from "../../utils/constants";
import {getValueFromUrl} from "../../utils/handleUrlFilters";

export const Shimmer: FunctionComponent = () => {
  const facetsArray = Array.from({ length: 4 });
  const { screenSize } = useSensor();
  const numberOfColumns = screenSize.columns;
  const pageSizeValue = getValueFromUrl('page_size');
  const storeCtx = useStore();
  const defaultPageSizeOption =
      Number(storeCtx?.config?.perPageConfig?.defaultPageSizeOption) ||
      DEFAULT_PAGE_SIZE;
  const pageSizeDefault = pageSizeValue
      ? Number(pageSizeValue)
      : defaultPageSizeOption;
  const productCardArray = Array.from({ length: pageSizeDefault });
  return (
    <div className="ds-widgets bg-body py-2">
      <div className="flex">
        <div className="ds-widgets_results flex flex-col items-center pt-16 w-full h-full">
          <div className="flex flex-col max-w-5xl lg:max-w-7xl ml-auto w-full h-full">
            <div className="flex justify-end mb-[1px]">
              <ButtonShimmer />
            </div>
          </div>
          <div
            className="ds-sdk-product-list__grid mt-[1.25rem] grid-cols-1 gap-y-8 gap-x-md sm:grid-cols-2 md:grid-cols-3 xl:gap-x-4 pl-8"
            style={{
              display: 'grid',
              gridTemplateColumns: ` repeat(${numberOfColumns}, minmax(0, 1fr))`,
            }}
          >
            {productCardArray.map((_, index) => (
              <ProductCardShimmer key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shimmer;
