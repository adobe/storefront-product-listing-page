/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from "@testing-library/preact";

import { WishlistButton } from "./WishlistButton";

describe("WidgetSDK - UIKit/FilterButton", () => {
    test("renders", () => {
        const { container } = render(<WishlistButton type="inLineWithName" productSku="SKU-123" />);

        const elem = container.querySelector(`.ds-sdk-wishlist-inLineWithName-button`);

        expect(!!elem).toEqual(true);
    });
});
