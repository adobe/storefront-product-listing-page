import { InputButtonGroup } from '../../../widget-sdk/ui-kit';
import { FunctionComponent } from 'preact';

import useScalarFacet from '../../../hooks/useScalarFacet';
import { Facet as FacetType, PriceFacet } from '../../../types/interface';

interface ScalarFacetProps {
  filterData: FacetType | PriceFacet;
}

export const ScalarFacet: FunctionComponent<ScalarFacetProps> = ({
  filterData,
}) => {
  const { isSelected, onChange } = useScalarFacet(filterData.attribute);

  return (
    <InputButtonGroup
      title={filterData.title}
      attribute={filterData.attribute}
      buckets={filterData.buckets as any}
      type={'checkbox'}
      isSelected={isSelected}
      onChange={(args) => onChange(args.value, args.selected)}
    />
  );
};
