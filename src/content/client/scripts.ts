/**
 * 20 PERSONALISED SCRIPTS. Written for each client.
 *
 * Every script has a title, a hook, the script itself (one paragraph per
 * beat), and a call to action where one makes sense. The first entry is a
 * finished example so the page and the copy button can be seen working;
 * replace it with the client's own. A script with no body renders as a slot.
 */
export type Script = {
  n: number;
  title: string;
  hook?: string;
  body?: string[];
  cta?: string;
  example?: boolean;
};

export const scripts: Script[] = [
  {
    n: 1,
    title: "Why this jet can stay in the air for 17 hours",
    hook: "This aircraft can fly from London to Los Angeles without stopping. But range is not the reason most owners choose it.",
    body: [
      "The Global 7500 is one of the longest range business jets ever built. Seven thousand seven hundred nautical miles. That is London to Los Angeles, or Dubai to New York, with no fuel stop.",
      "Most people assume that is the reason it sells. It is not.",
      "Walk through the cabin and you find four separate living areas. A place to eat. A place to work. A place to sleep. A place for the crew to rest. On a fourteen hour flight, that is the difference between arriving and arriving ready.",
      "So when someone tells you they bought this aircraft for the range, ask them where they slept.",
    ],
    cta: "If you want to know what a flight like that actually costs, that is the next video.",
    example: true,
  },
  ...Array.from({ length: 19 }, (_, i) => ({ n: i + 2, title: "" })),
];

export function scriptAsText(s: Script) {
  const lines: string[] = [s.title.toUpperCase(), ""];
  if (s.hook) lines.push("HOOK", s.hook, "");
  if (s.body?.length) lines.push("SCRIPT", ...s.body.flatMap((p) => [p, ""]));
  if (s.cta) lines.push("CALL TO ACTION", s.cta, "");
  return lines.join("\n").trim();
}
