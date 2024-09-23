/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from "@testing-library/preact";

import { SearchBar } from "./SearchBar";

describe("WidgetSDK - UIKit/SearchBar", () => {
    test("renders", () => {
        const { container } = render(<SearchBar phrase="" onKeyPress={() => {}} onClear={() => {}} />);

        const elem = container.querySelector(".ds-sdk-search-bar");

        expect(!!elem).toEqual(true);
    });
});
