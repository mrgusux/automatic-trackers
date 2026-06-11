# 🔒 Security Policy

## Supported Versions

Only the latest version on the `main` branch is supported with security updates.

| Version | Supported |
| ------- | --------- |
| `main` (latest) | ✅ |
| Anything older  | ❌ |

## Reporting a Vulnerability

If you discover a security vulnerability, please **DO NOT open a public issue, discussion, or pull request.** Public disclosure before a fix exists puts every user at risk.

### How to Report (in order of preference)

1. **GitHub Private Vulnerability Reporting (preferred):**
   Go to the repository's **Security** tab → **Report a vulnerability**, or use this direct link:
   https://github.com/mrgusux/automatic-trackers/security/advisories/new
   This creates a private advisory visible only to you and the maintainer.

2. **Fallback:** If private reporting is unavailable, open a [blank issue](https://github.com/mrgusux/automatic-trackers/issues/new) titled **"Security: please contact me"** with **no technical details**, and the maintainer will arrange a private channel.

### What Counts as a Vulnerability (In Scope)

- 🧪 **Sanitization bypass** — crafting input that survives the filtering pipeline in `scripts/update.sh` (e.g., injecting localhost/private-IP/malformed tracker URLs into the final lists)
- 🦠 **Malicious tracker injection** — a way to force known-bad trackers past the `blacklist.txt` exclusion filter
- ⚙️ **CI/CD compromise** — privilege escalation, secret exfiltration, or arbitrary code execution through our GitHub Actions workflows
- 📦 **Supply-chain issues** — a compromised or hijacked upstream source / pinned action / Docker base image
- 🐳 **Container escape or privilege escalation** in our Docker setup

### What Is NOT a Vulnerability (Out of Scope)

- Dead, slow, or unreachable trackers in the lists (open a [Bug Report](https://github.com/mrgusux/automatic-trackers/issues/new?template=bug_report.yml) instead)
- Issues in the upstream tracker lists themselves (report to their maintainers)
- The general legality of BitTorrent trackers in your jurisdiction

## Response Process & Timeline

This project is maintained by a volunteer. Realistic commitments:

| Stage | Target |
| ----- | ------ |
| Acknowledgement of your report | within **72 hours** |
| Initial assessment & severity triage | within **7 days** |
| Fix or mitigation for confirmed issues | as soon as possible, prioritized by severity |
| Public disclosure | after a fix is released, coordinated with you |

## Disclosure Policy

- Please give us reasonable time to fix the issue before any public disclosure.
- We will credit you in the advisory and release notes (unless you prefer to stay anonymous).
- Good-faith security research on this repository will never result in legal action from the maintainer (**safe harbor**).

## Verifying What You Download

- File integrity: compare against [`SHA256SUMS.txt`](SHA256SUMS.txt) using `sha256sum -c SHA256SUMS.txt`.
- Release artifacts are signed with [Sigstore Cosign](https://docs.sigstore.dev/) — see the `.sig` files attached to releases.
