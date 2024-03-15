/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import '../PromoTile/PromoTile.css';

import {
  PromoTileResponse,
  RedirectRouteFunc,
} from '../../types/interface';


export interface PromoTileProps {
  promoTile: PromoTileResponse;
  setRoute?: RedirectRouteFunc | undefined;  
}

export const PromoTile: FunctionComponent<PromoTileProps> = ({
  promoTile,
}: PromoTileProps) => {
    return (
      <>      
        <div
          className={`promo-tile relative rounded-md overflow-hidden}`}
        >
          <a
            href={promoTile.destination}            
            className="!text-primary hover:no-underline hover:text-primary"            
            >
            <img src={promoTile.image} alt={promoTile.title || ''}/>
          </a>
        </div>        
      </>
    );
};

export default PromoTile;
