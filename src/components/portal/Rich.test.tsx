import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Rich } from "@/components/portal/Rich";

const html = (text: string) => renderToStaticMarkup(<Rich text={text} />);

describe("Rich", () => {
  it("leaves plain text alone", () => {
    expect(html("Forty thousand pounds, London to Nice.")).toBe("Forty thousand pounds, London to Nice.");
  });

  it("sets **bold** and *emphasis*", () => {
    expect(html("We recommend **15 finished videos** first.")).toBe('We recommend <strong class="font-medium text-[color:var(--ink)]">15 finished videos</strong> first.');
    expect(html("Use analytics to understand *why*.")).toBe('Use analytics to understand <em class="em-serif">why</em>.');
  });

  it("handles both in one string, in either order", () => {
    expect(html("*one* and **two**")).toBe('<em class="em-serif">one</em> and <strong class="font-medium text-[color:var(--ink)]">two</strong>');
    expect(html("**two** and *one*")).toBe('<strong class="font-medium text-[color:var(--ink)]">two</strong> and <em class="em-serif">one</em>');
  });

  it("prints a lone star rather than eating the rest of the line", () => {
    expect(html("Rated 5* by clients")).toBe("Rated 5* by clients");
    expect(html("Unfinished **bold")).toBe("Unfinished **bold");
    expect(html("Unfinished *em")).toBe("Unfinished *em");
  });

  it("does not run past the end on an empty mark", () => {
    expect(html("a ** b")).toBe("a ** b");
    expect(html("")).toBe("");
  });
});
