import type { Guide } from "@/content/types";

export const editing: Guide = {
  chapter: "create",
  slug: "editing",
  title: "Retention editing blueprint",
  kicker: "Control what the viewer sees, hears and feels from the first second until the last.",
  intro: [
    "Editing is not about adding as many effects as possible. The editor's job is to control what the viewer sees, hears and feels from the first second until the last.",
  ],
  opener: [
    {
      kind: "list",
      title: "Every decision should serve one of three purposes",
      items: ["Make the story easier to understand", "Keep the viewer interested", "Increase the emotional impact of the video"],
    },
    { kind: "p", text: "If an edit does none of those things, you probably do not need it." },
  ],
  film: { title: "How to edit" },
  sections: [
    {
      n: "01",
      title: "Build the edit around the story",
      blocks: [
        { kind: "p", text: "Before worrying about captions, sound effects or transitions, make sure the video itself works." },
        {
          kind: "questions",
          title: "Ask",
          items: [
            "What is the viewer being promised at the beginning?",
            "What are they waiting to find out?",
            "What information do they need along the way?",
            "What is the final payoff?",
          ],
        },
        { kind: "p", text: "Your edit should guide them through that journey. For example, imagine the video begins:" },
        { kind: "lines", mode: "spoken", items: ["This aircraft can fly from London to Los Angeles nonstop, but range is not the reason most owners choose it."] },
        { kind: "p", text: "You have immediately created two questions." },
        { kind: "questions", items: ["How can it fly that far?", "If range is not the main reason, what is?"] },
        { kind: "p", text: "The edit should protect those questions. Do not reveal the answer immediately. Build towards it." },
        { kind: "list", title: "You might show", style: "tag", items: ["The aircraft exterior", "A range graphic", "The cabin", "A comparison with another aircraft"] },
        { kind: "p", text: "Then eventually reveal the feature or reason being discussed. That is retention editing. You are controlling when information is given to the viewer." },
        {
          kind: "aside",
          label: "The principle",
          text: "Do not simply place clips in the order they were filmed. Place them in the order that makes the story most interesting to watch.",
        },
      ],
    },
    {
      n: "02",
      title: "Win the first few seconds",
      blocks: [
        { kind: "p", text: "The beginning of the edit is disproportionately important. The viewer has not committed to watching yet. They are deciding whether to stay or scroll. Remove anything that delays the interesting part." },
        {
          kind: "lines",
          title: "Do not begin with",
          mode: "dim",
          items: [
            "Someone getting into position",
            "An unnecessary logo animation",
            "A long establishing shot",
            "A person saying hello",
            "Several seconds of music before anyone speaks",
          ],
        },
        { kind: "p", text: "Start with the strongest combination of visual and audio you have." },
        {
          kind: "keyed",
          items: [
            { label: "If the hook is", lines: ["“Can you identify this private jet from the windows alone?”"] },
            { label: "Then", lines: ["Do not open with a generic shot of an airport. Open with a close shot of the windows. Let the visual reinforce the question immediately."] },
            { label: "If the video begins", lines: ["“We nearly lost this aircraft deal 24 hours before completion.”"] },
            { label: "Then", lines: ["Consider opening with footage from the deal, the aircraft, the inspection or a reaction from the person telling the story."] },
          ],
        },
        { kind: "p", text: "The viewer should immediately feel like something is happening." },
        {
          kind: "sub",
          title: "The first frame test",
          blocks: [
            {
              kind: "steps",
              items: [
                { title: "Pause on the first frame", text: "Would that image make someone curious?" },
                { title: "Listen to only the first sentence", text: "Would that sentence make someone curious?" },
              ],
            },
            { kind: "p", text: "The strongest videos usually have both working together." },
          ],
        },
      ],
    },
    {
      n: "03",
      title: "Control pacing",
      blocks: [
        { kind: "p", text: "Fast editing does not automatically mean good editing. Pacing is about controlling how quickly the viewer receives new information. Some moments should move quickly. Others need room to breathe." },
        { kind: "p", text: "For example, during a private jet walkaround you may move quickly between:" },
        { kind: "list", style: "beat", items: ["Exterior.", "Engine.", "Cabin.", "Seats.", "Galley.", "Cockpit."] },
        { kind: "p", text: "But if someone reveals that an aircraft deal nearly collapsed, you might hold the shot slightly longer and allow the statement to land. The speed of the edit should reflect the moment." },
        {
          kind: "split",
          a: {
            label: "Speed up when",
            items: ["The information is simple", "The viewer already understands the context", "You are moving between features", "You are showing several visual examples", "You are building excitement"],
          },
          b: {
            label: "Slow down when",
            items: ["Something important is being revealed", "The viewer needs time to understand a point", "There is an emotional moment", "You are showing something visually impressive", "You are building tension"],
          },
        },
        {
          kind: "sub",
          title: "Remove dead space",
          blocks: [
            { kind: "p", text: "Watch the speaker closely. If there is a long breath, pause or unnecessary word, ask whether it needs to remain." },
            {
              kind: "swaps",
              fromLabel: "Before",
              toLabel: "After",
              pairs: [{ from: "So basically what you have to understand is that this aircraft has a range of...", to: "This aircraft has a range of..." }],
            },
            { kind: "p", text: "You have not removed any value. You have simply made the information arrive faster." },
          ],
        },
      ],
    },
    {
      n: "04",
      title: "Use cuts to maintain momentum",
      blocks: [
        { kind: "p", text: "Your cuts should feel almost invisible. Most viewers should not consciously notice the editing. They should simply feel that the video moves well." },
        {
          kind: "sub",
          title: "Jump cuts",
          blocks: [
            { kind: "list", title: "Use jump cuts to remove", style: "tag", items: ["Pauses", "Mistakes", "Repeated phrases", "Unnecessary words", "Long gaps between thoughts"] },
            { kind: "p", text: "They are particularly useful for direct to camera educational content." },
          ],
        },
        {
          kind: "sub",
          title: "Match cuts",
          blocks: [
            { kind: "p", text: "Match movement between two shots." },
            {
              kind: "pairs",
              aLabel: "Shot one",
              bLabel: "Shot two",
              items: [{ a: "Someone walking towards one aircraft.", b: "Them continuing the movement beside another aircraft." }],
            },
            { kind: "p", text: "This can make comparisons feel much more polished." },
          ],
        },
        {
          kind: "sub",
          title: "Audio continuity",
          blocks: [
            { kind: "p", text: "The viewer does not always need to see the person speaking. Allow their voice to continue while you show relevant footage." },
            {
              kind: "keyed",
              items: [
                { label: "The speaker says", lines: ["“The Global 7500 has four true living spaces.”"] },
                { label: "The cut", lines: ["Instead of staying on their face, cut to the different areas of the cabin while the explanation continues."] },
              ],
            },
            { kind: "aside", text: "The audio carries the story. The visuals prove the point." },
          ],
        },
      ],
    },
    {
      n: "05",
      title: "Show what the person is talking about",
      blocks: [
        { kind: "p", text: "This is one of the biggest advantages you have when creating aviation content. The subject itself is extremely visual. Use that." },
        {
          kind: "pairs",
          aLabel: "If someone says",
          bLabel: "Show",
          items: [
            { a: "“The windows on this Gulfstream are significantly larger.”", b: "The windows." },
            { a: "“This aircraft has a separate crew rest area.”", b: "The crew rest area." },
            { a: "A flight route", b: "A map." },
            { a: "The luggage compartment", b: "The compartment." },
            { a: "The cabin layout", b: "The layout, while they speak." },
          ],
        },
        { kind: "p", text: "This creates what we call visual confirmation. The viewer hears the information and immediately sees evidence of it. That makes the content easier to understand and more satisfying to watch." },
        {
          kind: "split",
          a: { label: "Bad B roll", items: ["Random footage of an aircraft that has nothing to do with the sentence."] },
          b: { label: "Good B roll", items: ["Footage that directly supports what is being said."] },
        },
        { kind: "aside", text: "The editor should constantly ask: *What could I show here that makes this sentence easier to understand?*" },
      ],
    },
    {
      n: "06",
      title: "Change the visual before attention drops",
      blocks: [
        { kind: "p", text: "If the screen looks identical for too long, the viewer has less visual stimulation." },
        {
          kind: "list",
          title: "You can refresh attention by changing",
          style: "tag",
          items: ["Camera angle", "Shot size", "Aircraft footage", "Cabin footage", "Graphics", "Text", "Maps", "Photographs", "Screenshots", "Archive footage", "Close ups"],
        },
        { kind: "p", text: "This does not mean cutting every second. The timing should feel natural. But if someone has been speaking directly to camera for several seconds without any visual change, ask whether the viewer needs something new to look at." },
        {
          kind: "sub",
          title: "Example",
          blocks: [
            {
              kind: "keyed",
              items: [
                { label: "Someone says", lines: ["“There are three reasons an aircraft can lose significant value.”"] },
                {
                  label: "The edit",
                  lines: [
                    "Start on the speaker.",
                    "When they say the first reason, show the relevant aircraft.",
                    "For the second, use a different visual.",
                    "For the third, return to the speaker or show another example.",
                  ],
                },
              ],
            },
            { kind: "p", text: "The information itself creates the structure for your visual changes." },
          ],
        },
      ],
    },
    {
      n: "07",
      title: "Use text to help the viewer",
      blocks: [
        { kind: "p", text: "Text should make information easier to consume. It should not cover the screen simply because you can add it." },
        {
          kind: "sub",
          title: "Captions",
          blocks: [
            {
              kind: "list",
              title: "Captions should",
              items: [
                "Match the speech accurately",
                "Appear in time with the words",
                "Be easy to read on mobile",
                "Stay away from faces and important visual information",
                "Remain consistent throughout the content",
              ],
            },
            { kind: "p", text: "The timing matters. If the captions are noticeably ahead of the speaker, the viewer reads the answer before hearing it. If they are too late, they feel disconnected." },
          ],
        },
        {
          kind: "sub",
          title: "Titles",
          blocks: [
            { kind: "p", text: "Titles should reinforce the reason to watch." },
            { kind: "lines", mode: "screen", items: ["Gulfstream vs Bombardier", "Can this jet fly nonstop?", "The biggest aircraft buying mistake"] },
            { kind: "p", text: "Keep them concise. The viewer should understand them almost instantly." },
          ],
        },
        {
          kind: "sub",
          title: "Information text",
          blocks: [
            { kind: "p", text: "Use text when numbers or specifications matter." },
            { kind: "lines", mode: "screen", items: ["7,750 NM range", "4 living areas", "Up to 19 passengers"] },
            { kind: "p", text: "The viewer should not have to remember every technical number mentioned verbally. Use the screen to help them." },
          ],
        },
      ],
    },
    {
      n: "08",
      title: "Use sound to create emotion",
      blocks: [
        { kind: "p", text: "A visually strong edit can still feel flat without good sound. Sound design gives footage weight." },
        { kind: "p", text: "Imagine a shot of a Gulfstream door closing. Without sound, it is simply an image. With the mechanical sound of the door locking into place, the moment feels more real." },
        {
          kind: "list",
          title: "The same applies to",
          style: "tag",
          items: ["Aircraft engines", "Footsteps", "Cabin doors", "Buttons", "Seat movements", "Objects being placed down", "Environmental airport noise", "Aircraft taking off"],
        },
        { kind: "p", text: "Use these sounds subtly. The viewer should feel them without being distracted by them." },
        {
          kind: "sub",
          title: "Music",
          blocks: [
            { kind: "p", text: "Music controls emotion. Use it deliberately." },
            {
              kind: "list",
              items: [
                "A fast paced aircraft delivery may benefit from energetic music.",
                "A founder story may work better with something slower and cinematic.",
                "An educational comparison may require very little music.",
              ],
            },
            { kind: "aside", text: "Always prioritise speech. If the viewer is struggling to hear the person because the music sounds dramatic, the mix is wrong." },
          ],
        },
      ],
    },
    {
      n: "09",
      title: "Use graphics to explain what footage cannot",
      blocks: [
        { kind: "p", text: "Some aviation topics are difficult to explain using camera footage alone. This is where graphics become useful." },
        {
          kind: "list",
          title: "For example",
          style: "tag",
          items: ["Aircraft range", "Flight routes", "Cabin dimensions", "Aircraft specifications", "Comparisons", "Timelines", "Ownership costs", "Aircraft performance"],
        },
        {
          kind: "keyed",
          items: [
            { label: "Imagine someone saying", lines: ["“The aircraft can fly approximately 7,500 nautical miles.”"] },
            { label: "The graphic", lines: ["A viewer may not immediately understand what that means. Showing a map from London with a range radius makes the information instantly understandable."] },
          ],
        },
        { kind: "aside", text: "That is what graphics should do. Simplify. Do not add graphics simply to make the edit look more complicated." },
      ],
    },
    {
      n: "10",
      title: "Create a recognisable editing style",
      blocks: [
        { kind: "p", text: "Your content should eventually feel like it belongs to your brand before someone even sees the account name." },
        {
          kind: "list",
          title: "Create consistency around",
          style: "tag",
          items: ["Fonts", "Caption styling", "Text placement", "Graphics", "Logo use", "Sound", "Colour treatment", "Title style"],
        },
        { kind: "p", text: "This does not mean every video should look identical. The format can change. The brand should remain recognisable." },
      ],
    },
    {
      n: "11",
      title: "Organise your editing workflow",
      blocks: [
        { kind: "p", text: "A clean workflow saves enormous amounts of time." },
        {
          kind: "list",
          title: "For every project, organise your files into clear folders",
          style: "tag",
          items: ["Footage", "Audio", "B roll", "Graphics", "Music", "Project files", "Exports"],
        },
        { kind: "p", text: "If you are editing ten or twenty pieces of content from one aviation shoot, poor file organisation quickly becomes a problem. Name footage clearly. Keep aircraft separated. Keep different filming locations separated. Keep interviews organised. Make it easy to find what you need." },
        { kind: "p", text: "Your editing software matters less than understanding the principles." },
        { kind: "list", title: "You can use tools such as", style: "tag", items: ["CapCut", "Premiere Pro", "DaVinci Resolve", "Final Cut Pro"] },
        { kind: "p", text: "The principles remain the same regardless of the software." },
      ],
    },
    {
      n: "12",
      title: "Watch the video like a viewer",
      blocks: [
        { kind: "p", text: "Before exporting, stop thinking like the person who edited it. Watch it as if you have never seen the footage before." },
        {
          kind: "questions",
          title: "Ask",
          items: [
            "Do I understand the video immediately?",
            "Would I keep watching after the first three seconds?",
            "Does anything feel slow?",
            "Is anything confusing?",
            "Are there moments where nothing changes?",
            "Do the visuals support what is being said?",
            "Are the captions easy to read?",
            "Is the dialogue clear?",
            "Does the music fit?",
            "Does the ending deliver what the opening promised?",
          ],
        },
        { kind: "p", text: "Then remove or change anything that weakens the experience." },
      ],
    },
    {
      title: "The final test",
      blocks: [
        {
          kind: "checklist",
          title: "Every element of the edit should answer at least one of these",
          items: ["Does this make the story clearer?", "Does this keep the viewer interested?", "Does this make the moment feel stronger?"],
          note: "If the answer is no, remove it.",
        },
      ],
    },
  ],
  rule: [
    {
      kind: "swaps",
      fromLabel: "A great editor does not ask",
      toLabel: "They ask",
      pairs: [{ from: "What effect can I add?", to: "What does the viewer need to see, hear or feel at this exact moment to keep watching?" }],
    },
    { kind: "p", text: "That is the difference between editing a video and editing for retention." },
  ],
};
