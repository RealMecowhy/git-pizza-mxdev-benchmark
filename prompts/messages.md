# Messages sent during a run

Nobody answers the agents' questions and nobody gives advice. After the prompt, a person sends only the texts below, word for word.

## Resume

Sent every time an agent stopped before all stories in scope were done:

```
Continue until every story in scope is done.
```

Every resume is counted and reported with the results.

## Fixed notes

Two notes exist for situations in which the plain resume text could not help. A note is sent in place of the resume text and is counted both as a resume and as a note. In the nine runs only the three Haiku runs received a note, and it was always the note "Back to the prompt": twice with Concord, twice with MXCLI and once with MxCraft.

### Trial licence of the local runtime

Sent when an agent stopped and named the licence or the session limit of the local Mendix runtime as the obstacle:

```
Environment note: the local Mendix runtime runs on a trial licence. It allows only a few sessions at a time and then refuses new ones (the runtime log says Maximum number of sessions exceeded). Restarting the app with RUN/stop.ps1 and RUN/start.ps1 clears all sessions, and signing out or closing the browser context after each check frees its slot. The runtime also stops itself after a few hours; restart it when that happens. No other licence is available and nobody answers questions: decide design questions yourself and record them in RUN/journal.md. Continue until every story in scope is done.
```

### Back to the prompt

Sent when an agent stopped and waited for an answer to a question that its prompt already answers. The note adds no knowledge; it sends the agent back to the prompt:

```
Environment note: nobody answers questions during the work, and the task has not changed. Re-read prompt.md: it says when to build and start the app with RUN/start.ps1 and when a story counts as done. Where something is unclear, take the most reasonable interpretation, record it in RUN/journal.md and RUN/delivery-notes.md, and continue. Continue until every story in scope is done.
```

`prompt.md` is the file with the prompt of the run, kept in the folder of the run.
