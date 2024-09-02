---
title: Sonarr
description: Sonarr Widget Configuration
---

Learn more about [Sonarr](https://github.com/Sonarr/Sonarr).

Find your API key under `Settings > General`.

Allowed fields: `["wanted", "queued", "series"]`.

A detailed queue listing is disabled by default, but can be enabled with the `enableQueue` option.

```yaml
widget:
  type: sonarr
  url: http://sonarr.host.or.ip
  key: apikeyapikeyapikeyapikeyapikey
  enableQueue: true # optional, defaults to false
  compactQueue: true # optional, defaults to false - shortens the queue in a scrollable box - does nothing if enableQueue is off
  collapsible: true # optional, defaults to false - provides a 'Download Queue" heading that collapses the queue similar to the services group heading - does nothing if enableQueue is off
```
