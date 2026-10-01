import { describe, expect, it } from "vitest";
import { CLIENT_SLUGS, DEMO_OPS_CLIENT_ID, OPS_CLIENT_IDS, isClientSlug, slugForOpsClient } from "@/content/clients/slugs";
import { clients, clientSlugs } from "@/content/clients/registry";

describe("the edge's slug list", () => {
  it("is the registry's list, so a valid cookie always has a tree to land in", () => {
    // Membership, not order: neither list's order carries meaning, and the
    // registry's own guard checks membership.
    expect([...CLIENT_SLUGS].sort()).toEqual([...clientSlugs].sort());
  });

  it("knows a client from anything else", () => {
    expect(isClientSlug("template")).toBe(true);
    expect(isClientSlug("demo")).toBe(true);
    expect(isClientSlug("a-client-we-offboarded")).toBe(false);
    expect(isClientSlug("")).toBe(false);
    expect(isClientSlug("__proto__")).toBe(false);
    expect(isClientSlug("constructor")).toBe(false);
  });
});

describe("each client's id in the Tilted Needle app", () => {
  it("is the registry's, client by client", () => {
    for (const slug of clientSlugs) expect(Object.hasOwn(OPS_CLIENT_IDS, slug) ? OPS_CLIENT_IDS[slug] : "", slug).toBe(clients[slug].identity.opsClientId);
  });

  it("leads a membership back to its portal, and nothing else does", () => {
    expect(slugForOpsClient(DEMO_OPS_CLIENT_ID)).toBe("demo");
    expect(slugForOpsClient(DEMO_OPS_CLIENT_ID.toUpperCase())).toBe("demo");
    expect(slugForOpsClient("11111111-1111-4111-8111-111111111111")).toBeNull();
    for (const x of ["", null, undefined, 42, {}, "__proto__", "constructor", "template", "demo"]) expect(slugForOpsClient(x), String(x)).toBeNull();
  });

  it("is never the template's: nobody signs in to the template", () => {
    expect(Object.hasOwn(OPS_CLIENT_IDS, "template")).toBe(false);
  });

  it("is never shared by two clients", () => {
    const ids = Object.values(OPS_CLIENT_IDS).map((id) => id.toLowerCase());
    expect(new Set(ids).size).toBe(ids.length);
  });
});
