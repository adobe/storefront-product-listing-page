/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from "@testing-library/preact";
import { describe, expect, test } from "vitest";

import { Pill } from "./Pill";

describe("WidgetSDK - UIKit/Pill", () => {
    test("renders", () => {
        const { container } = render(<Pill label="" onClick={() => {}} />);

        const elem = container.querySelector(".ds-sdk-pill");

        expect(!!elem).toEqual(true);
    });
});
