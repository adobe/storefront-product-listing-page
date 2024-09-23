/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

/// <reference types="@types/jest" />;
import { render } from "@testing-library/preact";

import Breadcrumbs from "./Breadcrumbs";
import { pages } from "./MockPages";

describe("WidgetSDK - UIKit/Breadcrumbs", () => {
    it("renders", () => {
        const { container } = render(<Breadcrumbs pages={pages} />);

        const elem = container.querySelector(".ds-sdk-breadcrumbs");

        expect(!!elem).toEqual(true);
    });
});
