/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from "@testing-library/preact";
import { describe, expect, test, vi } from "vitest";

import Loading from "./Loading";

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

describe("WidgetSDK - UIKit/Loading", () => {
    test("renders", () => {
        const { container } = render(<Loading label="" />);

        const elem = container.querySelector(".ds-sdk-loading");

        expect(!!elem).toEqual(true);
    });
});
