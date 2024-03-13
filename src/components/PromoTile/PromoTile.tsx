/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import '../PromoTile/PromoTile.css';

import {
  PromoTileConfiguration,
  RedirectRouteFunc,
} from '../../types/interface';


export interface PromoTileProps {
  promoTile: PromoTileConfiguration;
  setRoute?: RedirectRouteFunc | undefined;  
}

export const PromoTile: FunctionComponent<PromoTileProps> = ({
  promoTile,
}: PromoTileProps) => {

  const [url, setURL] = useState('');
  const [htmlContent, setHTMLContent] = useState('');


  useEffect(() => {
    setHTMLContent(extractHTML(promoTile.content));
  }, [promoTile]);

    
  const onProductClick = () => {    
    // window.magentoStorefrontEvents?.publish.searchProductClick(
    //   SEARCH_UNIT_ID,
    //   product?.sku
    // );
  };

  const extractHTML = (content: string): string => {
    const div = document.createElement('div');
    div.innerHTML = content;

    const anchorTag = div.querySelector('a');

    setURL(anchorTag?.getAttribute('href') || '');
   
    return anchorTag?.innerHTML || '';
  }

    return (
      <>      
        <div
          className={`promo-tile relative rounded-md overflow-hidden}`}
        >
          <a
            href={url}
            onClick={onProductClick}
            className="!text-primary hover:no-underline hover:text-primary"
            dangerouslySetInnerHTML={{
              __html: htmlContent,
            }}
            />
        </div>        
      </>
    );
};

export default PromoTile;
