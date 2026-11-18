# Deliverables

What the contractor hands back, in a fixed format. The formats are fixed because the automated tests and the completeness check read them without a person: the tests start and stop the app with the scripts of section 6.1 and check the other files against the formats below. A delivery that does not follow them is incomplete (`README.md` section 1, step 1).

| Deliverable | Content | Form |
|---|---|---|
| Git repository | The Mendix project for Studio Pro 11.16.1 with its full history: one commit per user story | Git repository (section 2) |
| `RUN/journal.md` | Work phases with timestamps, decisions, blockers and interpretations, in the order they happened | Markdown (section 3) |
| `RUN/self-assessment.json` | Every Lite user story: `done`, `partial` or `no`, and where it is in the app | JSON (section 4) |
| `RUN/delivery-notes.md` | Studio Pro version, Marketplace modules, custom code, mapping of the information model, mechanisms, deviations, contradictions, known issues, guest session timeout, duration of the work | Markdown from the template in section 5 |
| `RUN/operations.md` | How to build, start and stop the app locally with non-interactive commands, how the constants are set, where the server log is, base URL and screen URL paths, test window | Markdown from the template in section 6 |
| `RUN/start.ps1`, `RUN/stop.ps1` | Start the app with given constants and stop it again, called by the automated tests | Windows PowerShell 5.1 scripts (section 6.1) |

These are the deliverables listed in `00-README.md` section 8; this document defines their exact content.

**Not delivered in Lite** (each was a deliverable of the full product and has no purpose here):

| Not delivered | Why |
|---|---|
| A running public instance and its URL | The app runs locally (NFR-18.1); the automated tests build and start it themselves from the repository. |
| Demo account credentials | There are no accounts (information model section 2). |
| An exported `.mpk` file | The Git repository is the project; it is built with the Studio Pro 11.16.1 tools. |
| Own test results, screenshots, NFR measurements, log extract | The automated tests execute every TC and E2E, take their own screenshots and measurements and read the server log directly (`README.md` section 2). |
| Effort report in hours | The duration of the work is visible in `RUN/journal.md` (timestamps) and stated once in `RUN/delivery-notes.md`. |

---

## 1. Delivery structure

The repository root contains the Mendix project and the folder `RUN/`:

```text
<repository root>/
├── <project>.mpr                (Mendix project, Studio Pro 11.16.1)
├── javasource/, javascriptsource/, theme/, themesource/, widgets/, userlib/, …   (as created by Studio Pro)
└── RUN/
    ├── journal.md
    ├── self-assessment.json
    ├── delivery-notes.md
    ├── operations.md
    ├── start.ps1
    └── stop.ps1
```

Rules for all files:

- Markdown and JSON files in UTF-8, English. Dates `YYYY-MM-DD`, times `HH:mm` (24-hour) with the time zone stated once per file, decimal point `.`.
- IDs exactly as in the package (`US-101`, `NFR-05.3`, `SCR-09`, `BR-PRICE-08`, `LITE-CFG-04`).
- Contractor-local IDs: deviations `DEV-01`, `DEV-02`, …; known issues `KI-01`, `KI-02`, …. They are numbered per delivery and are not package IDs.
- No real personal data and no secrets in the repository. The demo password of the built-in administrator user that the Mendix project needs may stay in the project: it protects nothing outside this demo and is not a secret of it. State the user name and where the password is set (or the password itself) in `RUN/delivery-notes.md` section 2.3.

---

## 2. Git repository

| # | Requirement |
|---|---|
| G.1 | The repository contains the complete Mendix project for Studio Pro **11.16.1** (`NFR-01`): model, theme, styles, custom widgets, Java and JavaScript actions, Marketplace modules, the images used from `assets/`, and the logic that creates the seed on an empty database (`NFR-16.1`). |
| G.2 | The project opens in Studio Pro 11.16.1 without an upgrade prompt, and `mx check` reports 0 errors (`NFR-01.3`). From a fresh clone, `RUN/start.ps1` alone builds and starts the app locally with the full seed (`NFR-18.5`, section 6.1). |
| G.3 | **One commit per user story.** After finishing a story of `03-user-stories/` (or the part of it that the contractor delivers), the contractor commits with the message `US-xxx: <title>`, the title exactly as in `03-user-stories/` (for example `US-101: Choose a payment method and demo test card`). Work that belongs to no single story (project setup, theme, information model, seed, simulator core) is committed with a short message that names its area (for example `Setup: project and modules`, `Seed: demo data loader`). A commit may contain several stories only when they cannot be built separately; its message then lists them (`US-061, US-062: …`). |
| G.4 | The history is not rewritten after delivery (no squash or force push of delivered commits). |
| G.5 | No data snapshot or database file is needed to start the app; the seed is created by the app itself (G.1). Build output (`deployment/`, `releases/`, caches) is not committed. |

---

## 3. `RUN/journal.md`

A chronological log of the work, written while working (not reconstructed at the end).

```markdown
# Journal — Git Pizza MxDev Lite

Time zone: <for example Europe/Warsaw>

## 2026-12-01 09:00 — Phase: reading the package
- Decision: …
- Interpretation: … (also in delivery-notes.md section 7)

## 2026-12-01 10:30 — Phase: information model
- Blocker: … — resolved by …
```

| Rule | |
|---|---|
| Entries | One heading per phase or noteworthy event: `## YYYY-MM-DD HH:mm — <phase or event>`; below it short bullets starting with `Decision:`, `Interpretation:`, `Blocker:`, `Deviation:` or `Note:` |
| Phases | At least: reading the package, setup, information model and security, seed and reset, simulator, each epic or group of stories, testing, documentation |
| Interpretations | Every interpretation of an unclear or contradictory part of the package is recorded when it is made and repeated in `delivery-notes.md` section 7 |
| Pauses | Longer breaks are recorded (`Note: pause until …`) so the duration of the work can be read from the journal |

---

## 4. `RUN/self-assessment.json`

One entry per user story of `03-user-stories/` that exists in Lite (stories cut from Lite are left out).

```json
{
  "studioProVersion": "11.16.1.zzzzz",
  "stories": [
    { "id": "US-101", "status": "done", "where": "Checkout page SCR-06, payment section; payment sheet SCR-07", "notes": "" },
    { "id": "US-097", "status": "no", "where": "", "notes": "Could; not built (DEV-03)" }
  ]
}
```

| Key | Allowed values |
|---|---|
| `id` | `US-xxx` |
| `status` | `done` (every acceptance criterion met), `partial` (some criteria met; `notes` says which not), `no` (not built) |
| `where` | Short plain description of where the story is found in the running app (screen ID, page, panel, action); empty for `no` |
| `notes` | Free text; for `partial` and `no` the reason and the deviation (`DEV-xx`) |

---

## 5. `RUN/delivery-notes.md` — template

Copy this template into `RUN/delivery-notes.md` and fill every field. Do not remove sections or rows; write `none` or `n/a` where something does not apply.

````markdown
# Git Pizza MxDev Lite — Delivery notes

## 1. Summary

| Key | Value |
|---|---|
| Delivery date | YYYY-MM-DD |
| Package version used (00-README section 10) | |
| Studio Pro version (exact) | 11.16.1.zzzzz |
| Git commit of the delivery (hash) | |
| Work started / finished | YYYY-MM-DD HH:mm / YYYY-MM-DD HH:mm (time zone) |
| Duration of the work (hours, from the journal) | |
| Stories done / partial / no (from self-assessment.json) | |
| Deviations (count per type) | NOT_IMPLEMENTED n · PARTIAL n · CHANGED n · INTERPRETATION n |
| Known issues (count) | |
| `mx check` errors / warnings | 0 / n |
| Guest session inactivity timeout after all tabs are closed (LITE-SES-04, NFR-09.9) | … minutes |

## 2. Platform and components

### 2.1 Marketplace modules and widgets

| Name | Version | Purpose in this app | Free of charge (yes/no) |
|---|---|---|---|

### 2.2 Custom code

| Kind (Java action / JavaScript action / custom widget / SCSS / other) | Name | Purpose |
|---|---|---|

### 2.3 Security

| Item | Value |
|---|---|
| Security level | Production |
| User roles | Anonymous (guests); administrator role for the built-in admin user only |
| Built-in administrator | User name, and the demo password or where it is set (section 1) |
| Anonymous users enabled | yes |
| Pages and microflows reachable for `Anonymous` | short summary; must match information model section 10 |

### 2.4 Third-party runtime requests (NFR-13.7)

| Domain | Purpose |
|---|---|

## 3. How the main mechanisms work (short)

| Mechanism | Description (2–5 sentences each) |
|---|---|
| Simulator (tick mechanism and interval, how timer progress is stored for BR-ORD-21, speed factor from the constant, recovery after restart) — see NFR-07/NFR-08 "Implementation latitude" | |
| Live refresh of SCR-01, SCR-08, SCR-09 and the sidebar (interval, technique, what is kept on refresh per NFR-07.4) | |
| Guest sessions, cart and order access (LITE-SES-01 – LITE-SES-05) | |
| Home page KPIs without guest access to other orders (LITE-SEC-02) | |
| Seed, reset at start, scheduled reset at 04:00, housekeeping | |
| Server log lines (log node, where each line is written) | |
| Price calculation | |

## 4. Mapping of the information model

### 4.1 Objects

Every object of `04-information-model/information-model.md`, in its order.

| Package object | App name (Module.Entity) | Notes (split, merged, not persisted, not implemented) |
|---|---|---|

### 4.2 Enumerations

| Package enumeration | App name | Notes |
|---|---|---|

## 5. Deviations

Everything the app does differently from the package, including every Should not implemented and every Could implemented or not.

| ID | Type | Package reference | Package says | App does | Reason | Affected tests |
|---|---|---|---|---|---|---|
| DEV-01 | NOT_IMPLEMENTED / PARTIAL / CHANGED / INTERPRETATION | US-… / BR-… / SCR-… / NFR-… | | | | TC-… |

## 6. Known issues

| ID | Severity (Blocker/Major/Minor/Cosmetic) | Description | Steps to reproduce | Workaround | Affected tests |
|---|---|---|---|---|---|
| KI-01 | | | | | |

## 7. Contradictions and gaps found in the package

| # | Documents involved | Contradiction or gap | Interpretation chosen |
|---|---|---|---|

## 8. Assumptions

| Assumption (A-xx) | Built as stated (yes/no) | Notes |
|---|---|---|
````

### 5.1 Deviation types

| Type | Use when |
|---|---|
| `NOT_IMPLEMENTED` | A story, rule, screen, state or NFR is missing |
| `PARTIAL` | Implemented only in part (state which part) |
| `CHANGED` | Implemented differently from the package on purpose (state why) |
| `INTERPRETATION` | The package was unclear or contradictory and the contractor chose a reading (also listed in section 7) |

---

## 6. `RUN/operations.md` — template

Copy into `RUN/operations.md` and fill every section. Write for a Mendix developer who has never seen the project; the automated tests follow it literally.

````markdown
# Git Pizza MxDev Lite — Operations

## 1. Build, start and stop locally
Prerequisites (Studio Pro 11.16.1 or its command-line tools, Java, Docker if used) and the local runtime you chose. Exact non-interactive commands from a fresh clone: `RUN/start.ps1` and `RUN/stop.ps1` with their parameters, exit codes and duration; what the scripts do (build, runtime start, database, port). The base URL (for example `http://localhost:8080`). The database used (the built-in database is enough) and how to start with an empty database (NFR-16.1).

## 2. Constants
How the scripts set `Simulation.SpeedFactor` and `Simulation.ResetOnStartup` for a run without changing the project (NFR-18.6): the configuration they write or pass (for example a runtime configuration file or environment variables), the defaults, and where the values take effect (`lite-configuration.md` section 1).

## 3. Server log
Where the log is while the app runs (console output or file path), its line format (timestamp, level, log node, message), and an example of each line `CONFIG`, `RESET`, `ORDER`, `COURIER`, `SPAWN` (LITE-CFG-04 – LITE-CFG-07).

## 4. Screen URLs
One row per screen of the Lite inventory (SCR-01 – SCR-10, SCR-13, SCR-16, SCR-40, SCR-41): its URL path relative to the base URL (for example `/p/menu`) or "no own URL: reached from …", and how SCR-41 can be shown. The format of the guest tracking link (for example `/p/track/{trackingToken}`) and of the receipt link.

## 5. Reset and test window
What happens at a start with `ResetOnStartup = true` and at the scheduled reset at 04:00 store time (A-42); how long a reset takes; that tests run between 02:00 and 24:00 store time (A-31) and how a test interrupted by the 04:00 reset shows up (server log `RESET start by scheduled`).

## 6. Images and brand files
The exact steps to add a product photo, brand file or illustration delivered later (NFR-20.3, `assets/README.md` section 4): the project folder, the file names, the rebuild and the restart with `ResetOnStartup = true` that loads it into the data.

## 7. Known operational limits
For example memory needed, start-up time, anything that must be known before a run.
````

### 6.1 `RUN/start.ps1` and `RUN/stop.ps1`

The automated tests start and stop the app only through these two scripts, without a person and without the Studio Pro user interface. Every command in `RUN/operations.md` must be non-interactive (no prompt, no dialog, no manual step).

| Script | Requirements |
|---|---|
| `RUN/start.ps1` | Runs in **Windows PowerShell 5.1** from the repository root. Parameters `-SpeedFactor <n>` (integer; the valid values are 1, 2, 5 and 10, any other value is passed on unchanged so that the app applies the rule of `lite-configuration.md` section 1) and `-ResetOnStartup` with `$true` or `$false` (for example `RUN/start.ps1 -SpeedFactor 10 -ResetOnStartup $true`). Builds the project if needed, starts the app locally and sets the two constants for this run. Returns only when the app accepts HTTP requests at its base URL, prints the base URL (for example `http://localhost:8080`) and exits with code 0; if the app cannot be built or started, it exits with a non-zero code and an error message. |
| `RUN/stop.ps1` | Runs in **Windows PowerShell 5.1** from the repository root. Stops the app and every process and container that `RUN/start.ps1` started, and exits with code 0 when nothing is left running. |

- The constants are set by configuration that the scripts control (for example a runtime configuration file the script writes, or environment variables), never by editing the Mendix model and never through the Studio Pro user interface (NFR-18.6).
- Which local runtime runs the app (for example the Mendix runtime in a container, or the portable runtime started from the command line) is the contractor's choice; `RUN/operations.md` section 1 documents it, with its prerequisites.
- Calling `RUN/start.ps1` again after `RUN/stop.ps1` starts the app again with the given constants; the database is kept unless `-ResetOnStartup $true` restores the seed.

---

## 7. Delivery checklist (contractor self-check)

Before delivering, the contractor ticks:

- [ ] Every finished story committed with `US-xxx: <title>`; the delivered commit hash is in `RUN/delivery-notes.md`
- [ ] A fresh clone builds and starts with `RUN/start.ps1` alone and stops with `RUN/stop.ps1` (Windows PowerShell 5.1); `mx check` reports 0 errors
- [ ] With `ResetOnStartup = true` the server log shows `CONFIG …`, `RESET start by startup` and `RESET end …`
- [ ] `RUN/journal.md` written during the work, with timestamps
- [ ] `RUN/self-assessment.json` has one entry per Lite user story with valid values
- [ ] `RUN/delivery-notes.md` every section and row filled
- [ ] `RUN/operations.md` every section filled, including the base URL and the screen URL paths
