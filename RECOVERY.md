# Recovering the videos

Every video URL in this repo (6 films, 30 portfolio items, 109 board clips,
144 in total) points at `https://d6lso8oygmnu9.cloudfront.net/videos/…`.
That CloudFront distribution belonged to the AWS account behind the old
Amplify deployment, which was lost. Verified 2026-09-03/04:

- `d6lso8oygmnu9.cloudfront.net` has **no DNS record** at Google, Cloudflare
  or AWS's own authoritative server (`ns-418.awsdns-52.com`). The name is not
  merely unreachable from this machine; it no longer exists.
- `main.d1t3mjrfrjbzy.amplifyapp.com` is gone the same way.
- The Internet Archive holds **zero** captures of either host, and none of
  the site's videos. It does hold the 2024 Squarespace site at
  `www.tiltedneedle.com` (30 May 2024), whose video assets are also gone.
- No copies exist on this machine (searched by filename and for any large
  `.mp4`), and the ops app references no video storage.

So the files cannot be restored from anywhere public. They can be recovered
by three routes, in order of quality.

## Route 1: the studio's own masters (best)

Every filename is an edit export: `week-in-the-life-vf3-captioned`,
`being-realistic-v8-captioned`, `my-business-philosophy-fv`. The editors
who cut them have the masters and the captioned exports on their drives,
Dropbox, Frame.io or the NAS. Ask for the 144 files by the names in
`src/lib/case-studies-data.ts`, `site-data.ts` and `board-videos.ts`.

## Route 2: recover the AWS account (likely still holds everything)

CloudFront serves from an S3 bucket. Deleting a distribution does not delete
the bucket, and a lost login is not a closed account. If anyone can recover
the AWS **root email** for that account (password reset from the sign-in
page, or AWS Support with proof of ownership), the bucket almost certainly
still contains all 144 files under `videos/`. This is the one route that
returns the exact files the site was built with.

## Route 3: re-pull the published versions from the clients' channels

The studio published these on the clients' public accounts. The published
versions are compressed and carry platform captions, but they are the same
cuts. Downloading them is the studio's call (it owns the content; the
platforms' terms are the studio's to weigh), so this repo only lists where
they are. `yt-dlp` handles all three platforms.

### Who is in which clip

| Client (on screen) | Films / items | TikTok (from the 2024 site) | YouTube |
|---|---|---|---|
| Steve Varsano, The Jet Business | The Jet Broker; ~70 board clips (jets, sales, mindset, showroom) | `@thejetbusiness` | `@TheJetBusiness` (now part of Flexjet; 45 Shorts listed below) |
| Ameerh Naran, Vimana | ~25 board clips (Bugatti Bolide, Jesko, Pagani, Naran, Carrera GT, Aston DB9, GT racing, Vimana client story, WITL Dubai) | not embedded on the 2024 site | `@AmeerhNaran` |
| Noor Charchafchi, Celine Interior Design | High-End Interior Design; Vimana customer service; week in the life | `@celineinteriordesign` | `@CelineInteriorDesign` |
| Alexis Gauthier, Gauthier Soho | Restaurant Revival (file: `food-on-plane`) | not embedded on the 2024 site | `@gauthiersoho` |
| EuroEyes | Healthcare Performance (`time-efficiency-v10-captioned`, `saving-1-month-a-year-fv`) | `@euroeyes_augenlasern` | `@euroeyes`, `@EuroEyesUK` |
| Frankie Mardell, Trilogy Jewellers | Luxury Watch Dealer (`putting-yourself-out-there`, `wealth-shows-true-character-v6-captioned`) | `@trilogyjewellers` | `@frankiemardell-trilogy` |
| Rastah | E-commerce Scale (`my-business-philosophy-fv`, `running-multiple-businesses-v7-captioned`) | not embedded on the 2024 site | `@rastah3055` (unverified) |
| Tilted Needle (behind the scenes) | not on the site | `@tiltedneedle` | `@tiltedneedle` (21 Shorts) |

Also embedded on the 2024 site, not in today's data: `@dryannisofficial`,
`@laser.eye.clinic`.

TikTok refuses automated fetches ("Something went wrong"), so the TikTok
grids have to be browsed by a person. YouTube lists are below.

### The six films, by working filename

| Film | Client | File on the dead host | Where the published cut lives |
|---|---|---|---|
| 01 The Jet Broker | Steve Varsano | `expanding-tjb.mp4` | @thejetbusiness (TikTok/Instagram); no YouTube Short with this subject |
| 02 High-End Interior Design | Noor Charchafchi | `week-in-the-life-vf3-captioned.mp4` | @celineinteriordesign |
| 03 Restaurant Revival | Alexis Gauthier | `food-on-plane.mp4` | Subject reads as a Jet Business clip; check both @thejetbusiness and @gauthiersoho |
| 04 Healthcare Performance | EuroEyes | `time-efficiency-v10-captioned.mp4` | @euroeyes_augenlasern / @EuroEyesUK |
| 05 Luxury Watch Dealer | Frankie Mardell | `putting-yourself-out-there.mp4` | @trilogyjewellers / @frankiemardell-trilogy |
| 06 E-commerce Scale | Rastah | `my-business-philosophy-fv.mp4` | Rastah's channels; the title also matches a board clip |

### The Jet Business on YouTube (45 Shorts, fetched 2026-09-04)

These are the client's YouTube titles; the studio's working titles differ,
so match by watching. None obviously corresponds to `expanding-tjb`,
`how-to-be-pj-broker`, `food-on-plane` or `rolls-royce-fact`, which were
probably TikTok/Instagram-only.

- Not everyone who wants a private jet is a real buyer — https://youtube.com/shorts/iMqGv-W5DhY
- Buying a private jet? Don't forget about this — https://youtube.com/shorts/UKZha99IJjc
- Would you fly in a private jet with NO windows? — https://youtube.com/shorts/R0YRf0nWEw4
- What does it REALLY cost to own a $15M private jet? — https://youtube.com/shorts/vvfyWPtViUY
- How big is the private jet market in Asia? — https://youtube.com/shorts/gDw0saCDa7w
- How to buy a $25,000,000 corporate jet — https://youtube.com/shorts/kgexit7JaUA
- Same look, completely different price tags — https://youtube.com/shorts/1JyE72paX1A
- The quickest corporate jet deal — https://youtube.com/shorts/ty1jgO5T5F0
- Reacting to Koenigsegg's closed-wing patent — https://youtube.com/shorts/Q6w29LCIz04
- What do the numbers on corporate jets mean? — https://youtube.com/shorts/WtFrrO8SvTE
- Longest time to sell a corporate jet — https://youtube.com/shorts/qu8kpWisQBM
- The Jet Business is now part of Flexjet — https://youtube.com/shorts/RRfOAyW0gAs
- How we achieve data-driven excellence in corporate jet sales — https://youtube.com/shorts/jw2aSeiir3Q
- Strategic chartering offsets the cost of ownership — https://youtube.com/shorts/DUCIKKJp2TE
- Touring a $50,000,000 corporate jet — https://youtube.com/shorts/EcAAmQII-9c
- Why principals choose us — https://youtube.com/shorts/DEuqrU7q9Rc
- How to network better — https://youtube.com/shorts/6KFDvM4xWBo
- How to sell a $4,000,000 corporate jet — https://youtube.com/shorts/LXKSK6wOidM
- Don't live by excuses, live by delivering — https://youtube.com/shorts/2YPm0s5yEA8
- Underpromise, but overdeliver — https://youtube.com/shorts/YyXw6z3WUMQ
- If you want more, work harder — https://youtube.com/shorts/U-WuYdoDy5w
- How the video wall works — https://youtube.com/shorts/BC_ZaHvv01U
- Atlas Shrugged — https://youtube.com/shorts/D_ubro-OuZ0
- Negotiation tactics used when selling corporate jets — https://youtube.com/shorts/x5Oq85HB94g
- The story of my first ever jet sale — https://youtube.com/shorts/qj-bCVEaxko
- "We Are as Gods" recommendation — https://youtube.com/shorts/ssGNFlTQEjc
- Touring a $60,000,000 corporate jet — https://youtube.com/shorts/KGVOiwba6gA
- Tony Robbins book launch — https://youtube.com/shorts/E27rbLH-Elc
- Where does the principal of a corporate jet sit? — https://youtube.com/shorts/EAvfLLZk1t0
- What is a high-performance takeoff? — https://youtube.com/shorts/3mG5AduZ-OY
- The whole Falcon family — https://youtube.com/shorts/ealHy50xGIg
- Are rising fuel prices affecting private jets? — https://youtube.com/shorts/DMtWe4wCT_Q
- How the type of clients have changed through the years — https://youtube.com/shorts/OfGdXnBkGq4
- Why I have the best job in the world — https://youtube.com/shorts/1wi6hd6kqVc
- Different ways people negotiate — https://youtube.com/shorts/NUJwiOpfaL8
- Reacting to an Airbus Corporate Jet — https://youtube.com/shorts/HEdkGMatZN0
- Flying to Germany for a conference and back in a day — https://youtube.com/shorts/iCZ5Nhl9mMk
- Selling private jets to CEOs of corporations — https://youtube.com/shorts/Yvmc9jl1Hjo
- How the showroom was designed — https://youtube.com/shorts/X6CmNLgHv_M
- Touring a $10,000,000 corporate jet — https://youtube.com/shorts/b_GjZ5I4LH4
- Reacting to F1 viral picture — https://youtube.com/shorts/OPeLbjGVQ04
- Steve Varsano on his first jobs after university — https://youtube.com/shorts/eCpDHU1Hs3M
- 3 sales tips from 40 years of corporate jet sales — https://youtube.com/shorts/UURns7hS2y0
- Steve Varsano on his university days — https://youtube.com/shorts/G7T-0egeHQY
- 3 rules you must follow on a private jet — https://youtube.com/shorts/AdBomjIwksA

### Tilted Needle on YouTube (19 Shorts, behind the scenes)

Not the films, but real studio footage that could stand in for the Pixabay
placeholder behind "play reel" until a showreel exists.

- The story of The Jet Business — https://youtube.com/shorts/f_2N7Ukd9mI
- How we make content for the world's best interior designer — https://youtube.com/shorts/d0t4mzQWfNc
- a week in the life at Tilted Needle — https://youtube.com/shorts/ZZk_Fz8jl1U
- filming with our client in Switzerland — https://youtube.com/shorts/VLc98MZRCqw
- What $50,000,000 worth of cars looks like — https://youtube.com/shorts/w01i_-g_jYs
- how we started Youmi's YouTube channel — https://youtube.com/shorts/O-eErgvlUYs
- Michelin star chef rates our lunch — https://youtube.com/shorts/tYJ-49YJtHM
- £3 vs £300 lunch — https://youtube.com/shorts/Dvn35lH9WRs
- Testing Swiss Chocolate — https://youtube.com/shorts/v3hxL4C3GRc
- I nearly got fired for taking my boss to yoga — https://youtube.com/shorts/TbMvsw1253Y
- check out the final video on YouTube @early — https://youtube.com/shorts/WPe64iptrYs
- @TheJetBusiness — https://youtube.com/shorts/93f2iVn6rIc
- @thejetbusiness @stevevarsano — https://youtube.com/shorts/yEN_FW-UsoA
- How to create viral content — https://youtube.com/shorts/ndcIuLarFQo
- How to go viral! — https://youtube.com/shorts/hvD9rJcoFYI
- How to go viral on social media! — https://youtube.com/shorts/w6jiZA5qbdg
- How to go viral on social media — https://youtube.com/shorts/ExW9B6Cv4Dw
- How to get paid to create social media videos! — https://youtube.com/shorts/je0o6p_yxwQ
- How to get paid to make TikToks — https://youtube.com/shorts/UmWrpCKmBmk

## Once the files are back

1. Upload them somewhere the studio controls (Cloudflare R2 with a public
   bucket, or Supabase Storage; both serve video with range requests).
2. Replace the host in the three data files (one find-and-replace of
   `https://d6lso8oygmnu9.cloudfront.net/videos/`).
3. `node scripts/posters.mjs` to extract posters and durations.
4. `npm run build`, verify, commit `public/posters` and `src/lib/posters.json`.
