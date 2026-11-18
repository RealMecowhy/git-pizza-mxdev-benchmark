# Git Pizza MxDev Lite: materials of a Mendix build benchmark

Can an AI agent build a whole Mendix app from one prompt? We gave the same task to nine runs: three ways of building a Mendix app with Claude Code, each with three Claude models. This repository holds what the agents received, so that you can read it, check it and run the task yourself.

| | Haiku 5.5 | Sonnet 5.5 | Opus 5.5 |
|---|---|---|---|
| **Concord** 8.0.0 | 1 run | 1 run | 1 run |
| **MXCLI** 0.30.0 | 1 run | 1 run | 1 run |
| **MxCraft** | 1 run | 1 run | 1 run |

The task is a pizza ordering app for guests, "Git Pizza MxDev Lite": 111 user stories with acceptance criteria, a clickable prototype, a design system and demo data. The clickable prototype is online at <https://gitpizza.mecowhy.dev>.

## What is in this repository

| Path | What it is |
|---|---|
| `package-lite/` | The handover package, exactly as the agents received it. Start with `package-lite/00-README.md` |
| `prompts/` | The prompt of a run: the common part, the tool section of each variant and the messages sent during a run. Start with `prompts/README.md` |
| `hooks/commit-msg` | The Git hook installed in the project of every run. It refuses commits that break the commit rules of the prompt |
| `RULES.md` | The rules of the benchmark: what was the same for every run, when we resumed an agent, when a run ended and how we counted stories, time and cost |

## What is not here

- **MxCraft.** It is our own tool and it is not public. The MxCraft runs received the same package and the same common prompt as the others, followed by a tool section that says how to build with MxCraft. That section describes how the tool works, so it is not in this repository. MXCLI and Concord are public, and their sections are published in full.
- **The results.** Numbers, charts and our review of the nine apps are in the report and the article. The link will be added here when they are published.
- **Session records and the agents' own journals.** We used them to count time, tokens and cost.

## Who we are in this comparison

We are Mikołaj Jankiewicz and Karol Siejek, the authors of MxCraft, one of the three tools compared. We wrote the package, the prompt and the rules, and we ran all nine runs. Read the results with that in mind; this repository exists so that you do not have to take the set-up on trust.

## Licence

The materials in this repository are licensed under Creative Commons Attribution 4.0 International (CC BY 4.0), see `LICENSE`. You may use and change them, also commercially, when you name the source: the Git Pizza MxDev Lite benchmark by Mikołaj Jankiewicz and Karol Siejek.

## Run it yourself

1. Create an empty Mendix 11.16.1 project and make it a Git repository on the branch `main`.
2. Copy `package-lite/` into the project folder and exclude it from Git.
3. Install `hooks/commit-msg` as the `commit-msg` hook of that repository.
4. Set up your tool in the project.
5. Start the agent with the prompt: `prompts/common.md`, followed by a tool section for your tool (use `prompts/variant-b-mxcli.md` or `prompts/variant-c-concord.md` as a model for your own).
6. Follow `RULES.md` for resumes and for the end of the run.
