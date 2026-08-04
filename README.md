# Evidence Room

A forensic training activity for students. You pick a crime scene, find every
piece of evidence in it, and choose how to package each item. The evidence is
then sealed and the clock jumps forward 24 and 72 hours so you can see what your
choices did to it. At the end you get an integrity report you can print or save
as a PDF and hand in.

There is no database and no sign-in. Everything a student sees comes from files
in this repository.

## Run it

```bash
bun install
bun run dev
```

Then open the site on port `8000`.

| Command | What it does |
| --- | --- |
| `bun run dev` | Runs the site while you work on it, reloading as you save |
| `bun run check` | Checks the code for mistakes |
| `bun run build` | Builds the finished site into `dist/` |
| `bun run preview` | Serves the built site |

## The three scenes

| Folder | Case | Items | The lesson it teaches |
| --- | --- | --- | --- |
| `riverside-apartment` | 24-071 | 8 | Wet and dry evidence in the same room |
| `woodland-trail` | 24-118 | 8 | Rain-soaked evidence, and a cast that must not crack |
| `abandoned-vehicle` | 24-153 | 8 | Sharp glass, fibres, and fumes that no bag can hold |

## How the files fit together

- **Scene content** — `public/scenes/<scene-id>/scene.json`, one file per scene
- **Scene pictures** — `public/scenes/<scene-id>/background.svg` and `objects/`
- **The list of scenes** — `public/scenes/index.json`
- **The packaging options** — `public/scenes/containers.json`
- **Screens** — `src/screens/` (choose, briefing, collect, timeline, report)
- **Reusable pieces** — `src/components/`
- **Look and feel** — `src/app.css` plus the `<style>` block in each component

## How to add a new crime scene

You need access to this repository to add a scene. Nothing here requires you to
write code — you are copying a folder and editing a text file.

1. **Pick a short id**, lowercase with dashes, e.g. `station-platform`.

2. **Copy an existing scene folder.** Duplicate
   `public/scenes/woodland-trail/` and rename the copy to your id.

3. **Replace the pictures.** Put your scene picture in `background.svg` (drawn
   to a 1600 × 900 rectangle) and one picture per item in `objects/`. Square
   pictures work best for items. SVG files are recommended because they stay
   sharp and print well, but PNGs also work — just make sure the file name in
   `scene.json` matches.

4. **Edit `scene.json`.** Change the wording at the top (title, case number,
   location, briefing), then write one entry per item. Each item needs:

   | Field | What it is |
   | --- | --- |
   | `id` | A short name, unique within the scene |
   | `number` | The label on the marker, e.g. `"01"` |
   | `name` | What the student sees it called |
   | `image` | The picture file, e.g. `"objects/keys.svg"` |
   | `alt` | A description of the picture for screen readers |
   | `description` | What the student reads when they examine it |
   | `x`, `y` | Where it sits on the picture — see below |
   | `correct` | The container that protects it |
   | `success` | Why the right choice worked |
   | `failure` | What went wrong, and why |
   | `conditionsIfCorrect` | Two labels: how it looks at 24 and 72 hours when packed correctly |
   | `conditionsIfWrong` | Two labels: how it looks at 24 and 72 hours when packed wrongly |

5. **Place each item.** `x` and `y` are percentages across and down the picture,
   so `"x": 50, "y": 50` is dead centre. Guess, save, look at the page, and
   nudge the numbers — the page reloads itself as you save. Keep `y` at 78 or
   less so the label does not disappear behind the evidence tape.

6. **Add your scene to the list.** Add one entry to
   `public/scenes/index.json` with the id, title, subtitle, location, case
   number, and a one-line blurb.

7. **Save and look.** If something is wrong, the page tells you which scene and
   which item to fix.

### Choosing the right answer

The activity teaches four rules. Keep your answer key consistent with them:

- **Plastic bag** — small, dry items. Seals them in so nothing is lost.
- **Paper bag** — anything wet or damp, and anything biological. Lets it dry
  instead of growing mould and destroying the DNA.
- **Hard-sided container** — sharp, fragile, or crushable things. Stops the item
  damaging its packaging, its evidence, or the person carrying it.
- **Clean metal can** — fuels and other things that give off fumes. Vapour
  escapes any bag.

A scene only offers the containers listed in its `containers` field, so a scene
without anything volatile simply leaves out `"metal"`.

## Printing a report

At the end of a scene, use **Print / Save as PDF**. The navigation and buttons
are hidden automatically, and there is a space at the top for the student's name.

## Tech choices, and why

Recorded so they don't get "corrected" later:

- **Svelte 5 with runes, not SvelteKit.** The activity is four screens in a
  single sitting; it has no need of routing or a server.
- **Plain CSS, not Tailwind.** The forensic case-file look is a hand-built
  design system, and keeping it as ordinary CSS keeps it readable and printable.
- **No database.** Scene content is static, and students do not need accounts,
  so files in the repository are simpler and there is nothing to administer.
