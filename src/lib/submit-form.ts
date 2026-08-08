export type FormPayload = {
  type: "contact" | "application" | "demo";
  name: string;
  email: string;
  message: string;
  company?: string;
  role?: string;
  experience?: string;
  link?: string;
};

type Result = { ok: true } | { ok: false; error: string };

function buildMailto(payload: FormPayload, to: string, subject: string) {
  const lines: string[] = [];
  const add = (label: string, value?: string) => {
    if (value && value.trim()) lines.push(`${label}: ${value.trim()}`);
  };

  if (payload.type === "application") {
    add("Name", payload.name);
    add("Email", payload.email);
    add("Role", payload.role);
    add("Experience", payload.experience);
    add("Portfolio / CV", payload.link);
  } else {
    add("Name", payload.name);
    add("Email", payload.email);
    add("Company", payload.company);
  }
  add("Message", payload.message);

  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    lines.join("\n")
  )}`;
}

export async function submitForm(payload: FormPayload): Promise<Result> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.ok) return { ok: true };

    // Server has no mail transport configured — hand off to the user's client.
    if (data.fallback && data.to) {
      window.location.href = buildMailto(payload, data.to, data.subject || "Tilted Needle");
      return { ok: true };
    }

    return {
      ok: false,
      error:
        data.error ||
        "Something went wrong. Please email us directly at info@tiltedneedle.com.",
    };
  } catch {
    return {
      ok: false,
      error: "Network error. Please try again or email info@tiltedneedle.com directly.",
    };
  }
}
