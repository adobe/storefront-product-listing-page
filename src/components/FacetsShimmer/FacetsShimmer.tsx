/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import '../FacetsShimmer/FacetsShimmer.css';

export const FacetsShimmer: FunctionComponent = () => {
  return (
    <>
      <div className="ds-sdk-input ds-sdk-input--loading">
        <div className="ds-sdk-input__content">
          <div className="ds-sdk-input__header">
            <div className="ds-sdk-input__title shimmer-animation-facet" />
          </div>
          <div className="ds-sdk-input__list">
            <div className="ds-sdk-input__item shimmer-animation-facet" />
            <div className="ds-sdk-input__item shimmer-animation-facet" />
            <div className="ds-sdk-input__item shimmer-animation-facet" />
            <div className="ds-sdk-input__item shimmer-animation-facet" />
          </div>
        </div>
      </div>
      <div className="ds-sdk-input__border border-t mt-md border-neutral-200" />
    </>
  );
};

export default FacetsShimmer;
