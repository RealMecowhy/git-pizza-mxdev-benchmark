# The prompt of a run

Every run started with one message, put together from three files in this order:

1. `common.md`: the task, the low-code rule, the work loop with one commit per story, how often to check, the environment. The same file for all three variants.
2. The tool section of the variant:

   | Variant | File | Published |
   |---|---|---|
   | MxCraft | not in this repository | No: it describes how MxCraft works, and MxCraft is not public |
   | MXCLI | `variant-b-mxcli.md` | In full |
   | Concord | `variant-c-concord.md` | In full |

3. `shared-laptop.md`: several runs worked on one laptop at the same time, so every run got its own port range and the rule to stop only its own processes. `{PORTS}` was replaced with the range of the run, for example `8700 to 8799`.

After the first message a person sent only the fixed texts of `messages.md`.

The task and all its rules are in `common.md`. A tool section says which tool to build with and how the tool's own instructions apply in a run where nobody is there to answer.
