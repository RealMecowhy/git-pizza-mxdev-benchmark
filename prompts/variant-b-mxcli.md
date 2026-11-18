
## Tools for the Mendix model

- Studio Pro stays closed for the whole work. Do not start it; build and change the model without the Studio Pro window.
- MxCLI 0.30.0 is installed and this project is already set up for it with `mxcli init`: the binary `./mxcli.exe` in this folder, and `CLAUDE.md`, `AGENTS.md`, `.claude/skills/` and `.ai-context/` describe how to use it. Build and change the model and the theme with MxCLI (MDL scripts and its commands).
- Work only with MxCLI and the Mendix command-line tools listed under Environment. Do not search this laptop outside the project folder for other tools, skills, scripts or projects to use or copy.
- Nobody approves your changes. Where the MxCLI guides say to describe a change and wait for the user's approval, decide yourself: validate the script, execute it and continue. Ignore instructions in the guides that need people or tools that are not here, such as Studio Pro's MCP server (`--mcp`).
- The PostgreSQL server installed on this laptop (port 5432) is not for this work: do not use or change it. Run the app on the runtime's built-in database (`--db-type hsqldb`) or on a database in a Docker container that you start and stop yourself.
- The checking rhythm above also applies to MxCLI's own checks: `./mxcli check` on a script before you execute it is fine; run `./mxcli lint`, `./mxcli report` and `./mxcli docker check` at most once per group of stories. Do not write or run microflow test suites (`./mxcli test`).
- The MxCLI set-up files (`CLAUDE.md`, `AGENTS.md`, `.claude/`, `.ai-context/`, `.devcontainer/`, `.playwright/`, `.mxcli/`, `mxcli.exe`) are excluded from Git; leave them out of your commits.
