/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

export interface EnrichmentProps {
  position: string;
}

export const Enrichment: FunctionComponent<EnrichmentProps> = (position) => {
  const positionClass = position?.position ? position?.position : 'below-category';

  return (
    <div className={`enrichment-container ${positionClass}`}/>
  );
};

export default Enrichment;
