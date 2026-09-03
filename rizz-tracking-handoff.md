# Rizz Lending — Tracking Handoff Notes

*Last updated: September 2026*

## What this is about, in plain English

Rizz pays Google to show ads. When someone clicks an ad and then fills out the
loan application, Google needs to be told that it happened — otherwise there's
no way to know which ads are working.

A small piece of code on the website sends that message. It exists on the old
WordPress site. It needs to exist on the new site too.

To move it, I need two things: **account access** and **two ID strings**.

---

## Part 1: For the client — how to add me to Google Ads

*(Anyone with Admin access on the account can do this. Takes about a minute.)*

**Shortcut:** if they're already signed in, this link goes straight to the
right screen — skip to step 4.

`https://ads.google.com/aw/accountaccess/users`

1. Go to **ads.google.com** and sign in
2. Click **Admin** in the left menu (gear icon)
3. Click **Access and security**
4. Click the blue **+** button
5. Enter my email address
6. Choose **Standard** for the access level
7. Click **Send invitation**

That's it. I'll get an email and accept from my end.

*If their menu says "Tools and Settings" instead of "Admin," that's an older
layout — Access and security is in there. The direct link above works either
way.*

**Two things that can go wrong:**

- My email has to be tied to a Google account. If the invite errors out, that's
  usually why.
- If an outside agency runs the ads, the client may not be able to do this
  themselves — the agency has to. Worth asking who manages the account before
  assuming.

**Ask in the meeting:** Who currently manages your Google Ads? And what counts
as a conversion for you — just the loan application, or phone calls and the
payment calculator too?

---

## Part 2: For me — what to find in WordPress

Log in at `rizzlending.com/wp-admin`. Everything lives in the dark sidebar on
the left.

### Step 1 — Check the plugins

Click **Plugins**. Scan the list for names containing *Google*, *Tag*,
*Analytics*, *Pixel*, *GTM*, or *Site Kit*. Common ones:

| Plugin | Where the IDs are |
|---|---|
| Site Kit by Google | Gets its own "Site Kit" item in the sidebar; IDs shown plainly |
| GTM4WP / Google Tag Manager for WordPress | Settings page, container ID field |
| PixelYourSite | Settings page, handles Google + Facebook |
| WPCode / Insert Headers and Footers | Open it and read the pasted code |

### Step 2 — If no plugin fits

Try **Elementor → Custom Code**, then **Appearance → Theme File Editor** and
open `header.php`. Ctrl+F for `AW-`.

### Step 3 — What I'm copying

Any string that starts with one of these:

- `AW-123456789` — the ad account ID
- `AW-123456789/AbC-D_EfGhIjKlMnOp` — account ID + **label**, the important one.
  The label is the random-looking part after the slash. It says *which* action
  was tracked.
- `G-XXXXXXXXXX` — Google Analytics
- `GTM-XXXXXXX` — Google Tag Manager container

Copy the **whole surrounding snippet**, not just the ID. Context matters later.

> **Don't hit Save or Update on anything.** Reading only. As long as nothing
> gets saved, the live site can't break.

---

## Part 3: Why I still want account access even after finding the IDs

WordPress gives me strings with no names attached. If I find three labels, I
won't know which one is the loan application vs. a phone click, and I won't
know whether any of them are actually recording data or have been silently
broken for months.

That's only visible inside the Google Ads account. Extracting gets me building.
Access gets me confident before handoff.

---

## Order of operations

1. **In the meeting:** ask who runs the ads, request access. Time-sensitive —
   if an agency is involved this can take a week.
2. **Tonight:** pull the IDs out of WordPress.
3. **After that:** wire it into the Next.js site. That part is short — a few
   lines in the layout, one line in the form's success handler.
