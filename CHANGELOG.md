# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.2] - 2025-12-19
### Changed
- Removed automatic pushing from the **release script**.

### Fixed
- Fixed the **release CI job** to correctly publish new releases on GitHub.

## [0.1.1] - 2025-12-19
### Fixed
- Resolved issues in the **CI build and release** jobs to ensure proper execution
- Corrected the **release script** to work reliably with version tagging and publishing

## [0.1.0] - 2025-12-19
### Added
- **`Teltonika TCP Server`** support for codecs: **8, 8e, 12, 14, 16**
- **`Teltonika TLS Server`** support for codecs: **8, 8e, 12, 14, 16**
- **`Teltonika Parser`** for codecs: **8, 8e, 12, 14, 16**
- **`Teltonika Packet`** handling for codecs: **8, 8e, 12, 14, 16**
- **`Teltonika Command`** support for codecs: **12, 14**
- **`Teltonika Device`** integration to retrieve IMEI, access data, and send commands

[Unreleased]: https://github.com/Groupe-Savoy/teltonika-sdk/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/Groupe-Savoy/teltonika-sdk/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Groupe-Savoy/teltonika-sdk/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Groupe-Savoy/teltonika-sdk/releases/tag/v0.1.0
