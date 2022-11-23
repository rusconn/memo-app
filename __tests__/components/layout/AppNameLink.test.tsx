import { render, screen } from "@testing-library/react";

import AppNameLink from "@/components/layout/AppNameLink";

describe("link", () => {
  it("renders a app name", () => {
    render(<AppNameLink />);

    screen.getByText("メモアプリ");
  });
});
