# Contributing Guidelines

Thank you for showing interest in the development of **Codeplease.net**. We aim to provide a good collaborating environment for everyone involved, and as such have decided to list some of the most important things to keep in mind in the process. The guidelines below have been chosen based on past experience.

## Table of contents

1. [Reporting bugs](#reporting-bugs)
2. [Issue or discussion?](#issue-or-discussion)
3. [Submitting pull requests](#submitting-pull-requests)
4. [Resources](#resources)

## Reporting bugs

To track bug reports, we primarily use GitHub **issues**. When opening an issue, please keep in mind the following:

-   Before opening the issue, please search for any similar existing issues using the text search bar and the issue labels. This includes both open and closed issues (we may have already fixed something, but the fix hasn't yet been released).
-   When opening the issue, please fill out as much of the issue template as you can. In particular, please make sure to include logs and screenshots as much as possible. The instructions on how to find the log files are included in the issue template.
-   We may ask you for follow-up information to reproduce or debug the problem. Please look out for this and provide follow-up info if we request it.

If we cannot reproduce the issue, it is deemed low priority, or it is deemed to be specific to your setup in some way, the issue may be downgraded to a discussion. This will be done by a maintainer for you.

## Issue or discussion?

We realise that the line between an issue and a discussion may be fuzzy, so while we ask you to use your best judgement based on the description above, please don't think about it too hard either. Feedback in a slightly wrong place is better than no feedback at all.

When in doubt, it's probably best to start with a discussion first. We will escalate to issues as needed.

## Submitting pull requests

While pull requests from unaffiliated contributors are welcome, please note that due to significant community interest and limited review throughput, the core team's primary focus is on the issues which are currently [on the roadmap](https://github.com/orgs/ppy/projects/7/views/6). Reviewing PRs that fall outside of the scope of the roadmap is done on a best-effort basis, so please be aware that it may take a while before a core maintainer gets around to review your change.

In the case of simple issues, a direct PR is okay. However, if you decide to work on an existing issue which doesn't seem trivial, **please ask us first**. This way we can try to estimate if it is a good fit for you and provide the correct direction on how to address it. In addition, note that while we do not rule out external contributors from working on roadmapped issues, we will generally prefer to handle them ourselves unless they're not very time sensitive.

After you're done with your changes and you wish to open the PR, please observe the following recommendations:

-   Please submit the pull request from a [topic branch](https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows#_topic_branch) (not `master`), and keep the _Allow edits from maintainers_ check box selected, so that we can push fixes to your PR if necessary.
-   Please avoid pushing untested or incomplete code.
-   Please do not force-push or rebase unless we ask you to.
-   Please do not merge `master` continually if there are no conflicts to resolve. We will do this for you when the change is ready for merge.

If you're uncertain about some part of the codebase or some inner workings of the game and framework, please reach out either by leaving a comment in the relevant issue, discussion, or PR thread, or by posting a message in the [Discord server](https://discord.gg/vuw5PJNUWx). We will try to help you as much as we can.

## Resources

-   [Development roadmap](https://github.com/orgs/ppy/projects/7/views/6): What the core team is currently working on
