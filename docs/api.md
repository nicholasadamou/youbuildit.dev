---
title: API reference
description: Read published challenge metadata and retrieve available reference solutions.
group: Reference
---

# API reference

These read-only endpoints power the public website. No account is required. Use the same origin as your website instance; the production origin is `https://youbuildit.dev`.

## List challenges

`GET /api/challenges`

Returns an array of published challenge summaries. Fields include `slug`, `title`, `summary`, `difficulty`, `category`, `skills`, `estimatedTime`, `hasSolution`, and an optional `solutionLanguage`.

```bash
curl --fail https://youbuildit.dev/api/challenges
```

## Pick a random challenge

`GET /api/challenges/random`

Returns a randomly selected published challenge. An empty library returns an error rather than a fabricated challenge. Use the returned slug to open `/challenge/{slug}`.

## Read a solution

`GET /api/challenges/{slug}/solution`

Returns the available solution for a published challenge. A missing challenge or unavailable solution returns a non-success response. Inspect the response status before reading its payload.

## Download solution files

`GET /api/challenges/{slug}/solution/download`

Returns a ZIP attachment when solution files are available. Save the response as a file instead of parsing it as JSON.

```bash
# Replace example-slug with a published challenge that has solution files.
curl --fail --output solution.zip \
  https://youbuildit.dev/api/challenges/example-slug/solution/download
```

## Handle errors

Check HTTP status codes. A `404` means the requested content is unavailable. A `500` indicates a server-side failure; retry later and report persistent problems with the endpoint and status code. Do not display raw server diagnostics to end users or log connection strings.

These are the website's endpoints, not a versioned external API contract. Avoid frequent polling and handle additions or changes to response fields.
