import { cleanup } from "@testing-library/preact";
import { afterEach } from "vitest";

import "@testing-library/jest-dom/vitest";

afterEach(() => {
    cleanup();
});
