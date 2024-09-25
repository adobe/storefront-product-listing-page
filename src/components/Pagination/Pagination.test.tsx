/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from "@testing-library/preact";
import { describe, expect, it } from "vitest";

import Pagination from "./Pagination";

describe("PLP widget/Pagination", () => {
    it("renders", () => {
        const { container } = render(<Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />);

        const elem = container.querySelector(".ds-plp-pagination");

        expect(!!elem).toEqual(true);
    });
});
