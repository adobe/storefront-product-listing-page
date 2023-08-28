import { render } from "@testing-library/preact";

import { NoResults } from "./NoResults";

describe("WidgetSDK - UIKit/NoResults", () => {
    test("renders", () => {
        const { container } = render(
            <NoResults heading="" subheading="" isError={false} />,
        );

        const elem = container.querySelector(".ds-sdk-no-results__page");

        expect(!!elem).toEqual(true);
    });
});
