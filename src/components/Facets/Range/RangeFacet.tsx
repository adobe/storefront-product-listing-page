import { InputButtonGroup } from '../../../widget-sdk/ui-kit';
import { FunctionComponent } from 'preact';
import { PriceFacet } from 'src/types/interface';

import useRangeFacet from '../../../hooks/useRangeFacet';

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
