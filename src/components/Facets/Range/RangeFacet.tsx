/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { PriceFacet } from 'src/types/interface';

import useRangeFacet from '../../../hooks/useRangeFacet';
import { InputButtonGroup } from '../../../widget-sdk/ui-kit';

interface RangeFacetProps {
  filterData: PriceFacet;
}

export const RangeFacet: FunctionComponent<RangeFacetProps> = ({
  filterData,
}) => {
  const { isSelected, onChange } = useRangeFacet(filterData);

  return (
    <InputButtonGroup
      title={filterData.title}
      attribute={filterData.attribute}
      buckets={filterData.buckets}
      type={'radio'}
      isSelected={isSelected}
      onChange={(e) => {
        onChange(e.value);
      }}
    />
  );
};
