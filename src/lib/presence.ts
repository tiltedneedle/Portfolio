/**
 * A readable cookie that only says "someone is in": lets the pre-rendered
 * footer show the way out. Its own module, because the footer runs in the
 * browser and must not bring the rest of lib/auth.ts with it.
 */
export const PRESENCE = "tn-in";
