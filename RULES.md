# Rules of the benchmark

## 1. What is compared

Three ways of building a Mendix app with Claude Code, each with three Claude models: nine runs, one per cell. Every run builds the whole app on its own.

| Variant | How the agent builds | Tool and its knowledge |
|---|---|---|
| Concord | Claude Code in the Concord terminal inside Mendix Studio Pro | Concord2 Terminal+ 8.0.0 as it installs itself, with the Studio Pro MCP server switched on |
| MXCLI | Claude Code with MXCLI, Studio Pro closed | MXCLI 0.30.0 and the files that `mxcli init` writes for Claude Code |
| MxCraft | Claude Code with MxCraft, Studio Pro closed | MxCraft, our own tool, not public |

Models: Claude Haiku 5.5 at effort high, Claude Sonnet 5.5 and Claude Opus 5.5 at effort medium.

## 2. What every run received

- A new, empty Mendix 11.16.1 project as a Git repository on the branch `main`.
- The package `package-lite/` in the project folder, excluded from Git.
- The Git hook `hooks/commit-msg`, installed in that repository.
- The tool of its variant, set up in the project.
- The prompt as the first message (`prompts/README.md`).

## 3. What was the same for every run

1. **Same start.** The same package and the same task, on the same Mendix and Claude Code versions. The variants differ in the tool section of the prompt, the model and the tool.
2. **Clean configuration.** Every run has its own Claude Code configuration folder: no personal instructions, memory, hooks, MCP servers or skills other than those of its variant.
3. **The agent sees only the package.** No evaluation criteria, no tests, no other runs.
4. **Only the tools of its variant.** The prompt tells the agent to work with its tool and not to look for other tools outside the project folder.
5. **Full autonomy.** The agent works without permission prompts. The only messages from a person are the fixed texts of `prompts/messages.md`.
6. **Numbers come from the records, not from the agent.** Time, tokens and cost are counted from the session records of Claude Code; stories are counted from Git.

## 4. Resumes and notes

When an agent stops before all stories in scope are done, a person sends the fixed resume text. Two fixed notes exist for two situations in which the resume text could not help (`prompts/messages.md`). Every resume and every note is counted and reported.

## 5. When a run ends

A run ends when the agent finishes with all stories in scope done, or at the first of these:

- 10 resumes in a row without a new commit;
- 2 hours of working time without a new story with code;
- 13 hours of working time.

Whatever the agent built until then counts in full.

## 6. Stops that are not the agent's fault

A stop caused by the environment is cut out of the working time, and the resume that ends it is not counted. This covers a pause for the usage limit of the subscription and a hung response of the model, for example when the laptop went to sleep.

## 7. How we count

**Stories.** A story counts from its first commit that names it (`US-xxx: ...`) and changes something outside `RUN/`. A story without a commit of its own counts when a `Notes:` commit says in which other stories it was built and the agent's self-assessment marks it as done. Where an agent put the code of several stories into one commit named after other stories, we credited those stories at that commit; the results show them apart. This is what Git declares, not a test result.

**Working time.** Wall-clock time from the first message to the end of the run, minus the time the run waited for a person: the silence after an agent ended its turn, and any silence longer than 5 minutes that ends with a message from a person. Time in which the agent waits for its own background task, for example a build, is working time.

**Tokens.** From the session records of the main agent and all its subagents, one count per model response. Context compaction is not recorded as a response; we estimate it separately.

**Cost.** Each response is priced at the list API price of its model at the time of the benchmark. The runs used a subscription, so the figure is for comparison and is not an invoice.

## 8. Versions

| What | Version |
|---|---|
| Package | `package-lite/` of this repository |
| Mendix Studio Pro | 11.16.1 |
| Claude Code | 2.1.287 |
| Java | JDK 21.0.2 (Eclipse Adoptium) |
| MXCLI | 0.30.0 |
| Concord2 Terminal+ | 8.0.0 |
| MxCraft | not public; the version current when each run started |
| Docker Desktop | 29.8.0, available to the agent |

## 9. Deviations we know of

- **Runs in parallel.** Several runs worked on one laptop at the same time. This makes builds and app starts slower for all of them.
- **Notes.** A note is meant to be sent once per run. In the Haiku runs with Concord and with MXCLI the note was sent a second time; both are counted.
- **Resumes typed by a script.** In two MxCraft runs the fixed resume text was typed into the window of the run by a script, on our instruction, after the agent had ended its turn: the last ten resumes of the Sonnet run and all resumes of the Haiku run. One of them arrived cut to the single word `Continue`; the agent answered it like the others, and it is counted. One was sent while the agent waited for its own build; it is counted too.
- **Question dialogs.** The Haiku runs opened a question dialog five times in total. We closed each one without an answer.
- **Set-up changes for the benchmark.**
  - MXCLI: the session-start hook that `mxcli init` writes was removed, because it would create a database on the PostgreSQL server of the laptop. The MXCLI binary was already in the project.
  - Concord: Studio Pro was started with a remote debugging port, which Concord's own bridge to Maia needs.
  - MxCraft: the runs used a private copy of the tool, adapted to an environment without its internal companion tools. The set-up also enforced the tool's way of working: it refused some actions before they ran, and it refused commits that did not pass the tool's own checks. The other two variants had no such enforcement.
- **One run per cell.** Each of the nine cells is a single run.
