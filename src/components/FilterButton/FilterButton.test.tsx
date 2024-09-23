/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from "@testing-library/preact";

import { FilterButton } from "./FilterButton";

describe("WidgetSDK - UIKit/FilterButton", () => {
    test("renders", () => {
        const { container } = render(
            <FilterButton
                displayFilter={() => {
                    return;
                }}
                type="mobile"
            />,
        );

        const elem = container.querySelector(".ds-sdk-filter-button");

        expect(!!elem).toEqual(true);
    });
});
