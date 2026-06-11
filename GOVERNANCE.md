# 🏛️ Project Governance

This document outlines the governance model and decision-making process for the **Ultimate Torrent Tracker Aggregator** project.

## Roles and Responsibilities

### 👑 Lead Architect (BDFL)
- **Mohammad Munna ([@mrgusux](https://github.com/mrgusux))**
- Holds final decision-making authority on architecture, features, code reviews, releases, and security policy.
- Manages repository access, branch protection, and community guidelines.

### 🔧 Maintainers
- Listed in [MAINTAINERS.md](MAINTAINERS.md), with their responsibilities and the path to becoming one.
- May review and merge Pull Requests and triage issues.

### 🛠️ Contributors
- Anyone with a merged Pull Request, a valid issue report, a proposed tracker source, or a documentation improvement.
- See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

## Decision-Making Process

This project operates under the **"Benevolent Dictator For Life" (BDFL)** model: community feedback is actively sought and highly valued, but final technical and directional decisions rest with the Lead Architect.

| Change type | Process |
| --- | --- |
| Minor (typos, docs, small fixes) | Direct Pull Request → maintainer review → merge |
| New tracker sources | [Feature Request](https://github.com/mrgusux/automatic-trackers/issues/new?template=feature_request.yml) → source quality check → merge |
| Major (pipeline logic, workflow schedule, output formats) | Open a [Discussion](https://github.com/mrgusux/automatic-trackers/discussions) first → community feedback → BDFL decision → Pull Request |
| Security-sensitive | Strictly via [SECURITY.md](SECURITY.md), handled privately |

## Adding and Removing Maintainers

- **Adding:** nominated by an existing maintainer based on sustained, high-quality contributions (see [MAINTAINERS.md](MAINTAINERS.md)); approved by the BDFL.
- **Stepping down:** maintainers may step down anytime and will be honored in the Emeritus section.
- **Removal:** for sustained inactivity or [Code of Conduct](CODE_OF_CONDUCT.md) violations, by BDFL decision.

## Code of Conduct

All participants in governance and decision-making must adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

## Amendments

Anyone may propose changes to this governance model via Pull Request. Changes take effect only when explicitly approved and merged by the Lead Architect.
