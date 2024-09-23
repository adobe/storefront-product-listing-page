/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from "@testing-library/preact";

import { LabelledInput } from "./LabelledInput";

describe("WidgetSDK - UIKit/InputButtonGroup", () => {
    test("renders", () => {
        const { container } = render(
            <LabelledInput
                type="checkbox"
                checked={false}
                name=""
                onChange={() => {}}
                label=""
                value=""
                attribute=""
            />,
        );

        const elem = container.querySelector(".ds-sdk-labelled-input");

        expect(!!elem).toEqual(true);
    });
});
