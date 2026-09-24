import { describe, expect, it } from "vitest";
import { askHref } from "@/lib/ask";

describe("askHref", () => {
  it("writes the mail for an address", () => {
    const href = askHref({ contact: "info@tiltedneedle.com", name: "Horizon Aviation" }, "Authority 01", "The mistake buyers make.");
    expect(href.startsWith("mailto:info@tiltedneedle.com?subject=")).toBe(true);
    const url = new URL(href);
    expect(url.searchParams.get("subject")).toBe("Script request from Horizon Aviation");
    expect(url.searchParams.get("body")).toBe("Authority 01: The mistake buyers make.\n\nCould you write this one up as a script?");
  });

  it("hands over to a link when the contact is not an address", () => {
    expect(askHref({ contact: "https://wa.me/447700900000", name: "X" }, "A 01", "t")).toBe("https://wa.me/447700900000");
    expect(askHref({ contact: "https://example.com/contact?to=studio@example.com", name: "X" }, "A 01", "t")).toBe("https://example.com/contact?to=studio@example.com");
  });
});
