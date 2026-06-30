# Codex Instructions

This repository is managed through the Performance Dudes workspace.

Before doing any work, read and follow `CLAUDE.md` in this directory. Treat it as
the authoritative repository instruction file.

If a nested directory contains another `CLAUDE.md`, read and follow that file for
work in that subtree.

Do not bypass repository-specific setup, signing, merge, secret, or workflow
rules.

Codex-specific notes:

- Codex does not load the Claude plugin system from `.claude/settings.json`.
- Use `agent-sync` through `~/.config/agent-sync/settings.json` and the
  `clients.profiles.codex` commands.
- When using the shared channel, run `agent-sync start` and `agent-sync status`,
  then poll the relevant group with `agent-sync poll <group>`. For this repo,
  `<group>` is usually `website`; if unsure, inspect `agent-sync config` and
  `agent-sync status`.
- Poll before taking shared-repo work and before the final response. Send agent
  messages with `agent-sync send <group> "<message>"`; send Signal messages to
  humans with `agent-sync send --signal <group> "<message>"`.
