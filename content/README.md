# Blog content

Posts live in `content/posts/` as Markdown. `npm run build` turns them into the static pages under `blog/`, the Atom feed, the sitemap and the "Blog" section on the homepage. Do not edit the generated files by hand.

## Write a post

1. `npm run new -- "Post title"` creates a draft, dated next Monday.
2. Write it. Remove `draft: true` when it is ready.
3. `npm run build`, check `blog/<slug>/index.html` locally (`python3 -m http.server`), commit everything, open a PR.

A post with a future `date` is merged but stays unpublished. The `Blog` GitHub Action builds every morning and publishes it on that date. To keep a weekly rhythm, write a few posts ahead and give them consecutive Monday dates.

## Front-matter

| Key | Required | Notes |
| --- | --- | --- |
| `title` | yes | Shown on the page and in social previews. |
| `description` | yes | Meta description and lede. Aim for 120 to 155 characters. |
| `date` | yes | `YYYY-MM-DD`, the publish date. |
| `updated` | no | Set it when you change a published post. Updates `dateModified` and the sitemap. |
| `slug` | no | URL part. Defaults to the file name without the date. Never change it after publishing. |
| `seoTitle` | no | `<title>` tag if it should differ from `title`. Keep it under 60 characters. |
| `tags` | no | Comma-separated. The first tag is the article section. |
| `keywords` | no | Comma-separated search phrases. |
| `ogTitle`, `ogKicker` | no | Text on the generated social image. |
| `draft` | no | `true` keeps the post out of every build. |

The social image `blog/<slug>/og.png` is generated once with Playwright. Delete it and rebuild to regenerate it.

## Style, topics and facts

- `STYLE.md`: the mandatory writing style. ASD-STE100 plus human-voice rules. `npm run lint:posts` checks the rules a script can check, and CI runs it on every PR.
- `TOPICS.md`: the topic pool and queue. The weekly writer takes the next `queued` topic.
- `NOTES.md`: the experience bank. Posts use only personal facts from here or from the public site. Add real stories to it, because they make the posts sound like you.

## Weekly writer

A scheduled Claude task runs every Sunday morning (Europe/Berlin). It writes the next post from the queue, dated the coming Tuesday, and opens a PR on a `blog/` branch. You get a push notification and a Todoist task. Review the PR, confirm the claims it lists, and merge it before Tuesday 07:00. The Blog workflow publishes it on Tuesday morning.
