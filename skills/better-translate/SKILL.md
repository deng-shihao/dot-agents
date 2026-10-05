---
name: better-translate
description: >
  Translate English into Chinese in natural human voice. Use before writing or polishing any Chinese translation of English content.
---

# English-to-Chinese Translation

Produce natural, accurate Chinese translations that read as if written by a native speaker — free of 翻译腔 (translationese) and AI slop patterns.

## Overview

AI models produce predictable defects in Chinese translation: English word order calqued into Chinese, filler phrases added for politeness, over-emphasis not present in the source, and tone shifts. This skill provides a structured iterative workflow to eliminate these issues through comprehension, translation, and repeated polish passes.

## When NOT to Use

- Translating into languages other than Chinese
- Translating non-English source text
- Writing original Chinese content (not a translation)
- Quick gloss translations where quality is unimportant

## Translation Workflow

### Phase 1: Comprehension

Read the full English source document before translating anything.

Resolve terminology from the source, project context, and established usage. Ask only when an unresolved meaning would materially change the translation. Continue with independent passages while waiting. Keep minor ambiguities faithful to the source instead of inventing precision.

### Phase 2: Initial Translation

Translate the full document in one pass. During the initial draft:

- Preserve all formatting (headings, lists, code blocks, links, images)
- Keep proper nouns untranslated (product names, project names, person names)
- Translate technical terms by established convention (e.g., "machine learning" → "机器学习")
- Match the source tone and formality level
- Do not polish during this phase — produce a complete draft first

### Phase 3: Iterative Polish

Run the accuracy, fluency, and slop checks below. After a correction, recheck the affected passage against the source and its surrounding text. Repeat only for an identified defect.

#### Accuracy Check

Compare translated text against the English source line by line. Fix:

- 含义改变 — meaning differs from source
- 添油加醋 — content added that source does not contain
- 遗漏 — content present in source but missing from translation
- 格式改变 — formatting broken (headings, links, code blocks)
- 标点符号 — English punctuation left in Chinese text, or wrong Chinese punctuation
- 语法错误 — grammatical errors in Chinese

#### Fluency Check

Read the Chinese text without referring to the English source. Fix:

- 英语语序 — English word order literally transplanted into Chinese
- 费解的表述 — phrasing that requires re-reading to understand
- 缺少衔接 — missing transitions between sentences or paragraphs
- 不自然的搭配 — word combinations no native Chinese speaker would use
- 能否改用更自然的表述 — rephrase for naturalness without changing meaning

#### AI Slop Check

Detect and remove AI-specific defect patterns:

- 过度强调 — excessive emphasis ("极其", "至关重要" where source says "important")
- 废话填充 — filler phrases not in source ("值得注意的是", "不言而喻", "毋庸置疑")
- 不自然的客套 — unnatural hedging or politeness not matching source tone
- 原文没有的展开 — elaboration added beyond what source states
- 翻译腔 — literal calques, unnatural collocations, mechanical "的" chains

For unfamiliar patterns, consult [translation examples](references/translation-examples.md).

### Final Validation

After the three checks:

1. Read the complete Chinese document from start to finish, as a Chinese reader, without referring to the English source.
2. Ask: does this read like a native Chinese speaker wrote it? Any AI slop indicators or 翻译腔 remaining?
3. Recheck any correction against the English source. Verify that names, numbers, claims, links, and code remain intact.
4. Deliver the complete translation when every source passage is accounted for and no identified defect remains. Disclose unresolved material ambiguity.
