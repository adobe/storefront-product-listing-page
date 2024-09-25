/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from "@testing-library/preact";
import { describe, expect, it } from "vitest";

import { PriceFacet } from "@/types";

import { ScalarFacet } from "./ScalarFacet";

describe("PLP widget/RangeFacet", () => {
    it.skip("renders", () => {
        const { container } = render(<ScalarFacet filterData={{} as PriceFacet} />);

        const elem = container.querySelector(".ds-sdk-input");

        expect(!!elem).toEqual(true);
    });
});
