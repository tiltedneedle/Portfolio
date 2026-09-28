import { describe, expect, it } from "vitest";
import { getClient, clientSlugs } from "@/content/clients/registry";

describe("getClient", () => {
  it("finds a real client", () => {
    for (const slug of clientSlugs) expect(getClient(slug)?.identity.slug).toBe(slug);
  });

  it("does not hand back the prototype for a prototype key", () => {
    // `clients` is a plain object, so a bare index returns the Object
    // constructor for "constructor" and a function for "toString", both
    // truthy. /login?for=constructor answered 500 because of it.
    for (const key of ["constructor", "toString", "valueOf", "hasOwnProperty", "__proto__", "__defineGetter__"]) {
      expect(getClient(key), key + " must not resolve to a client").toBeUndefined();
    }
  });

  it("does not find a slug that is not a client", () => {
    expect(getClient("")).toBeUndefined();
    expect(getClient("northwind")).toBeUndefined();
  });
});
