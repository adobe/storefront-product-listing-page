/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { HTMLAttributes, useEffect, useState } from 'preact/compat';

import '../SliderDoubleControl/SliderDoubleControl.css';

import { useProducts, useSearch } from '../../context';
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

export const SliderDoubleControl: FunctionComponent<SliderProps> = ({
  filterData,
}) => {
  const productsCtx = useProducts();
  const searchCtx = useSearch();
  const min = filterData.buckets[0].from;
  const max = filterData.buckets[filterData.buckets.length - 1].to;
  const preSelectedToPrice = productsCtx.variables.filter?.find(
    (obj) => obj.attribute === 'price'
  )?.range?.to;
  const preSelectedFromPrice = productsCtx.variables.filter?.find(
    (obj) => obj.attribute === 'price'
  )?.range?.from;
  const [minVal, setMinVal] = useState(
    preSelectedFromPrice ? preSelectedFromPrice : min
  );
  const [maxVal, setMaxVal] = useState(
    preSelectedToPrice ? preSelectedToPrice : max
  );
  const { onChange } = useSliderFacet(filterData);

  const fromSliderId = `fromSlider_${filterData.attribute}`;
  const toSliderId = `toSlider_${filterData.attribute}`;
  const fromInputId = `fromInput_${filterData.attribute}`;
  const toInputId = `toInput_${filterData.attribute}`;

  useEffect(() => {
    if (
      searchCtx?.filters?.length === 0 ||
      !searchCtx?.filters?.find((obj) => obj.attribute === filterData.attribute)
    ) {
      setMinVal(min);
      setMaxVal(max);
    }
  }, [searchCtx]);

  useEffect(() => {
    const controlFromInput = (
      fromSlider: any,
      fromInput: any,
      toInput: any,
      controlSlider: any
    ) => {
      const [from, to] = getParsed(fromInput, toInput);

      fillSlider(fromInput, toInput, '#C6C6C6', '#904745', controlSlider);
      if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
      } else {
        fromSlider.value = from;
      }
    };

    const controlToInput = (
      toSlider: any,
      fromInput: any,
      toInput: any,
      controlSlider: any
    ) => {
      const [from, to] = getParsed(fromInput, toInput);
      fillSlider(fromInput, toInput, '#C6C6C6', '#904745', controlSlider);
      if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
      } else {
        toInput.value = from;
      }
    };

    const controlFromSlider = (
      fromSlider: any,
      toSlider: any,
      fromInput: any
    ) => {
      const [from, to] = getParsed(fromSlider, toSlider);
      fillSlider(fromSlider, toSlider, '#C6C6C6', '#904745', toSlider);

      if (from > to) {
        setMinVal(to);
        fromSlider.value = to;
        fromInput.value = to;
      } else {
        fromInput.value = from;
      }
    };

    const controlToSlider = (fromSlider: any, toSlider: any, toInput: any) => {
      const [from, to] = getParsed(fromSlider, toSlider);
      fillSlider(fromSlider, toSlider, '#C6C6C6', '#904745', toSlider);
      if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
      } else {
        setMaxVal(from);
        toInput.value = from;
        toSlider.value = from;
      }
    };

    const getParsed = (currentFrom: any, currentTo: any) => {
      const from = parseInt(currentFrom.value, 10);
      const to = parseInt(currentTo.value, 10);
      return [from, to];
    };

    const fillSlider = (
      from: any,
      to: any,
      sliderColor: any,
      rangeColor: any,
      controlSlider: any
    ) => {
      const rangeDistance = to.max - to.min;
      const fromPosition = from.value - to.min;
      const toPosition = to.value - to.min;
      controlSlider.style.background = `linear-gradient(
        to right,
        ${sliderColor} 0%,
        ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
        ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
        ${rangeColor} ${(toPosition / rangeDistance) * 100}%,
        ${sliderColor} ${(toPosition / rangeDistance) * 100}%,
        ${sliderColor} 100%)`;
    };

    const fromSlider = document.querySelector(
      `#${fromSliderId}`
    )! as HTMLInputElement;
    const toSlider = document.querySelector(
      `#${toSliderId}`
    )! as HTMLInputElement;
    const fromInput = document.querySelector(
      `#${fromInputId}`
    )! as HTMLInputElement;
    const toInput = document.querySelector(
      `#${toInputId}`
    )! as HTMLInputElement;

    fillSlider(fromSlider, toSlider, '#C6C6C6', '#904745', toSlider);

    fromSlider.oninput = () =>
      controlFromSlider(fromSlider, toSlider, fromInput);
    toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
    fromInput.oninput = () =>
      controlFromInput(fromSlider, fromInput, toInput, toSlider);
    toInput.oninput = () =>
      controlToInput(toSlider, fromInput, toInput, toSlider);
  }, [minVal, maxVal]);

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
    <div className="ds-sdk-input pt-md">
      <label className="ds-sdk-input__label text-[1rem] font-normal text-gray-900 font-['FuturaBT-Light']">
        {filterData.title}
      </label>

      <div class="ds-sdk-slider range_container">
        <div class="sliders_control">
          <input
            className="ds-sdk-slider__from fromSlider h-[6px]"
            id={fromSliderId}
            type="range"
            value={minVal}
            min={min}
            max={max}
            onInput={({ target }) => {
              if (target instanceof HTMLInputElement) {
                setMinVal(Math.round(Number(target.value)));
              }
            }}
            onMouseUp={() => {
              onChange(minVal, maxVal);
            }}
            onTouchEnd={() => {
              onChange(minVal, maxVal);
            }}
            onKeyUp={() => {
              onChange(minVal, maxVal);
            }}
          />
          <input
            className="ds-sdk-slider__to toSlider h-[6px]"
            id={toSliderId}
            type="range"
            value={maxVal}
            min={min}
            max={max}
            onInput={({ target }) => {
              if (target instanceof HTMLInputElement) {
                setMaxVal(Math.round(Number(target.value)));
              }
            }}
            onMouseUp={() => {
              onChange(minVal, maxVal);
            }}
            onTouchEnd={() => {
              onChange(minVal, maxVal);
            }}
            onKeyUp={() => {
              onChange(minVal, maxVal);
            }}
          />
        </div>
        <div class="form_control">
          <div class="form_control_container">
            <div class="form_control_container__time">Min</div>
            <input
              class="form_control_container__time__input"
              type="number"
              id={fromInputId}
              value={minVal}
              min={min}
              max={max}
              onInput={({ target }) => {
                if (target instanceof HTMLInputElement) {
                  setMinVal(Math.round(Number(target.value)));
                }
              }}
              onMouseUp={() => {
                onChange(minVal, maxVal);
              }}
              onTouchEnd={() => {
                onChange(minVal, maxVal);
              }}
              onKeyUp={() => {
                onChange(minVal, maxVal);
              }}
            />
          </div>
          <div class="form_control_container">
            <div class="form_control_container__time">Max</div>
            <input
              class="form_control_container__time__input"
              type="number"
              id={toInputId}
              value={maxVal}
              min={min}
              max={max}
              onInput={({ target }) => {
                if (target instanceof HTMLInputElement) {
                  setMaxVal(Math.round(Number(target.value)));
                }
              }}
              onMouseUp={() => {
                onChange(minVal, maxVal);
              }}
              onTouchEnd={() => {
                onChange(minVal, maxVal);
              }}
              onKeyUp={() => {
                onChange(minVal, maxVal);
              }}
            />
          </div>
        </div>
      </div>

      <div className={`price-range-display__${filterData.attribute} pb-[1.5rem]`}>
        <span className="ml-sm block-display text-[0.875rem] font-light text-gray-700 font-['FuturaBT-Light']">
          Between{' '}
          <span className="min-price text-gray-900 font-semibold">
            {formatLabel(minVal)}
          </span>{' '}
          and{' '}
          <span className="max-price text-gray-900 font-semibold">
            {formatLabel(maxVal)}
          </span>
        </span>
      </div>
    </div>
  );
};
