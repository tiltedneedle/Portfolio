import type { PublicIdentity } from "@/content/clients/types";

/**
 * Where "ask the studio" goes: a mail with the subject and the idea
 * already written when the contact is an address, otherwise the contact
 * link itself (a chat, a form, a page).
 */
export function askHref(who: Pick<PublicIdentity, "contact" | "name">, ref: string, text: string) {
  const contact = who.contact.trim();
  if (!contact.includes("@") || /^https?:\/\//i.test(contact)) return contact;
  const subject = "Script request from " + who.name;
  const body = ref + ": " + text + "\n\nCould you write this one up as a script?";
  return "mailto:" + contact + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
}
