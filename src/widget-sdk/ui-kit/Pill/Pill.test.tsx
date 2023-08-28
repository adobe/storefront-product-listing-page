import { render } from "@testing-library/preact";

import { Pill } from "./Pill";

describe("WidgetSDK - UIKit/Pill", () => {
    test("renders", () => {
        const { container } = render(<Pill label="" onClick={() => {}} />);

        const elem = container.querySelector(".ds-sdk-pill");

        expect(!!elem).toEqual(true);
    });
});
