---
name: read-arxiv-paper
description: Read an arXiv paper from its URL, inspect its source, and save a cited summary connected to the current project when relevant.
---

## Read the paper

1. Extract the paper ID and any explicit version from the supplied arXiv URL. Preserve both in the source URL, such as `https://arxiv.org/src/2601.07372v1`. Keep legacy IDs intact when they contain a subject prefix.
2. Use the project's existing paper cache if one exists. Otherwise, create a unique temporary directory. Reuse a download only after checking that it contains the requested paper and version.
3. Fetch with `curl -fsSL --connect-timeout 10 --max-time 60 '<source-url>' -o '<download-path>'`. Check the exit status and file type before reading or extracting it. An error page or empty response is a failed download.
4. Inspect the downloaded format. Read a plain source file directly; decompress or unpack only when the file type requires it. For an archive, list entries first and extract into the isolated directory. Reject absolute paths, parent-directory traversal, or links that escape that directory.
5. Locate the TeX entrypoint by inspecting document declarations and included files, rather than assuming its filename. Read the included sections, bibliography entries supporting key claims, and figure captions needed for the request. Track unread or missing material explicitly.
6. If source retrieval fails, try available arXiv HTML or PDF reading tools and disclose that source inspection was unavailable. Use [PDF reader](../pdf-reader/SKILL.md) when figures or page layout affect the interpretation.

## Save the findings

Summarize the problem, method, main evidence, limitations, and implications for the user's question. Cite the paper URL and version, plus sections or figures supporting important claims. Separate the authors' claims from your interpretation. When project application is requested or relevant, inspect the relevant project code before drawing connections.

Save the summary using the project's research-note convention. If none exists, use `knowledge/summary_<topic>.md`; choose a non-conflicting filename. Honor a user-requested output destination or chat-only format.

Read the saved summary back. Completion requires an answer to each requested question or an explicit evidence gap, accurate artifact pointers, and a returned absolute output path. Report partial reading without claiming the full paper was inspected.
