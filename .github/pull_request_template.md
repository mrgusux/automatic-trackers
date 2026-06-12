## 📝 Summary

<!-- What does this PR change, and why? -->

Fixes # (issue number, if applicable)

## 🛠 Type of change

- [ ] 🌐 New tracker source(s)
- [ ] 🚫 New blacklist source(s)
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (existing functionality affected)
- [ ] ⚙️ CI/CD or workflow change
- [ ] 🔒 Security fix
- [ ] 📦 Dependency update
- [ ] 📚 Documentation update

## 🌐 For new tracker / blacklist sources only

- [ ] Added to the correct array in `.github/workflows/update-trackers.yml`
      (`SOURCES` for good trackers, `BLACKLIST_SOURCES` for blacklists)
- [ ] Verified manually: `curl -sSfL <url> | head` returns plain-text tracker URLs (not HTML)
- [ ] The source is publicly accessible and actively maintained
- [ ] The source is not already in the list (no duplicates)
- [ ] No existing URLs were removed
- [ ] `SOURCES.md` updated with the new source and attribution

## 🚀 Quality Checklist

- [ ] I have performed a self-review of my own changes
- [ ] `make lint` (ShellCheck) passes
- [ ] `make test` (bats) passes
- [ ] I did NOT manually edit auto-generated files
      (`all_trackers.txt`, `udp.txt`, `http.txt`, `https.txt`, `ws.txt`,
      `all_trackers_comma.txt`, `SHA256SUMS.txt`, `.tracker_hash`, `api/*.json`)
- [ ] I have updated documentation where applicable
- [ ] I have read [CONTRIBUTING.md](../blob/main/CONTRIBUTING.md)

## 📸 Logs / Screenshots (if applicable)

<!-- Paste relevant output or screenshots here -->

<!--
Thank you for contributing! 🎉
Labels will be applied automatically based on the files you changed.
A maintainer review will be requested automatically via CODEOWNERS.
-->
