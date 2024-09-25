/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from "@testing-library/preact";
import { describe, expect, test, vi } from "vitest";

import { SortDropdown } from "./SortDropdown";

describe("WidgetSDK - UIKit/SortDropdown", () => {
    test("renders", () => {
        const handleChange = vi.fn();
        const { container } = render(
            <SortDropdown
                value="relevance_DESC"
                sortOptions={[{ label: "Most Relevant", value: "relevance_DESC" }]}
                onChange={handleChange}
            />,
        );

        const elem = container.querySelector(".ds-sdk-sort-dropdown");

        expect(!!elem).toEqual(true);
    });
});
