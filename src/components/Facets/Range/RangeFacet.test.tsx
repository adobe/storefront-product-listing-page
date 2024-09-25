/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from "@testing-library/preact";
import { describe, expect, it } from "vitest";

import { PriceFacet } from "@/types/interface";

import { RangeFacet } from "./RangeFacet";

describe("PLP widget/RangeFacet", () => {
    it.skip("renders", async () => {
        const { container } = render(<RangeFacet filterData={{} as PriceFacet} />);

        const elem = container.querySelector(".ds-sdk-input");

        expect(!!elem).toEqual(true);
    });
});
