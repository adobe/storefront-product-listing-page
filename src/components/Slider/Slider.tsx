/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { HTMLAttributes, useState } from 'preact/compat';

import '../Slider/Slider.css';

import { useProducts } from '../../context';
import useSliderFacet from '../../hooks/useSliderFacet';
import { PriceFacet } from '../../types/interface';

export interface SliderProps extends HTMLAttributes<HTMLInputElement> {
  filterData: PriceFacet;
}

export type Bucket = {
  title: string;
  id?: string;
  count: number;
  to?: number;
  from?: number;
  name?: string;
  __typename: 'ScalarBucket' | 'RangeBucket' | 'CategoryView';
};

export const Slider: FunctionComponent<SliderProps> = ({ filterData }) => {
  const productsCtx = useProducts();
  const { onChange } = useSliderFacet(filterData);
  const [selectedPrice, setSelectedPrice] = useState(
    filterData.buckets[filterData.buckets.length - 1].to
  );
  const handleSliderChange = (event: any) => {
    onChange(filterData.buckets[0].from, parseInt(event.target.value));
  };
  const handleNewPrice = (event: any) => {
    setSelectedPrice(parseInt(event.target.value));
  };

  const formatLabel = (price: number) => {
    const currencyRate = productsCtx.currencyRate
      ? productsCtx.currencyRate
      : '1';
    const currencySymbol = productsCtx.currencySymbol
      ? productsCtx.currencySymbol
      : '$';

    const label = `${currencySymbol}${
      price && parseFloat(currencyRate) * parseInt(price.toFixed(0), 10)
        ? (parseFloat(currencyRate) * parseInt(price.toFixed(0), 10)).toFixed(2)
        : 0
    }`;
    return label;
  };

  return (
    <>
      <p>{filterData.title}</p>
      <div class="ds-sdk-slider slider-container">
        <input
          type="range"
          id="price-range"
          class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
          min={filterData.buckets[0].from}
          max={filterData.buckets[filterData.buckets.length - 1].to}
          value={selectedPrice}
          onChange={handleNewPrice}
          onMouseUp={handleSliderChange}
        />
        <span className="selected-price">{formatLabel(selectedPrice)}</span>
        <div class="price-range-display">
          <span class="min-price">
            {formatLabel(filterData.buckets[0].from)}
          </span>
          <span class="max-price">
            {formatLabel(filterData.buckets[filterData.buckets.length - 1].to)}
          </span>
        </div>
      </div>
      <div className="ds-sdk-input__border border-t mt-md border-gray-200" />
    </>
  );
};
