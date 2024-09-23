/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from "preact";

import "../ButtonShimmer/ButtonShimmer.css";

export const ButtonShimmer: FunctionComponent = () => {
    return (
        <>
            <div className="ds-plp-facets ds-plp-facets--loading">
                <div className="ds-plp-facets__button shimmer-animation-button" />
            </div>
        </>
    );
};

export default ButtonShimmer;
