"""Preserve supplied PDF pages and extract numbered questions with provenance."""
import hashlib
import json
import re
from pathlib import Path
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
SOURCES = [
    ("notes", "OOPs complete notes_50614588_2025_02_18_21_28.pdf"),
    ("assignment-1", "OOPs MCQ Assignment-1_51992383_2025_03_28_20_36.pdf"),
    ("assignment-2", "OOPs MCQ Assignment-2_52737290_2025_03_28_20_36.pdf"),
]
documents = []
for key, filename in SOURCES:
    path = Path.home() / "Downloads" / filename
    reader = PdfReader(path)
    pages = [{"number": i + 1, "text": page.extract_text()} for i, page in enumerate(reader.pages)]
    doc = {"id": key, "filename": filename, "sha256": hashlib.sha256(path.read_bytes()).hexdigest(), "pages": pages}
    if key != "notes":
        lines = []
        for page in pages:
            for line in page["text"].splitlines():
                if re.search(r"Infeepedia|Subscribe Infeepedia|Download Infeepedia|Oops Assignment", line):
                    continue
                lines.append((page["number"], line.rstrip()))
        answer_start = next(i for i, (_, line) in enumerate(lines) if re.match(r"\s*1\.\s*Answer\s*:", line, re.I))
        questions, current = [], None
        for page, line in lines[:answer_start]:
            if re.search(r"Answer With Explanation", line, re.I):
                continue
            match = re.match(r"\s*(\d+)\.\s*(.*)", line)
            if match and 1 <= int(match[1]) <= 100 and (not current or int(match[1]) > current["number"]):
                current = {"number": int(match[1]), "pages": [page], "lines": [match[2]]}
                questions.append(current)
            elif current:
                current["lines"].append(line)
                if line.strip() and page not in current["pages"]:
                    current["pages"].append(page)
        answers, current = [], None
        for page, line in lines[answer_start:]:
            match = re.match(r"\s*(\d+)\.\s*Answer\s*:\s*([A-E])\b(.*)", line, re.I)
            if match:
                current = {"number": int(match[1]), "answer": match[2].upper(), "pages": [page], "lines": [match[3].strip()]}
                answers.append(current)
            elif current:
                current["lines"].append(line)
                if line.strip() and page not in current["pages"]:
                    current["pages"].append(page)
        doc["questions"] = [{"number": q["number"], "pages": q["pages"], "text": "\n".join(q["lines"]).strip()} for q in questions]
        doc["answers"] = [{"number": a["number"], "answer": a["answer"], "pages": a["pages"], "text": "\n".join(a["lines"]).strip()} for a in answers]
        expected = set(range(1, 101)) - ({99} if key == "assignment-1" else set())
        if {q["number"] for q in questions} != expected:
            raise ValueError(f"{key}: unexpected question numbering: {[q['number'] for q in questions]}")
        doc["missing_question_numbers"] = sorted(set(range(1, 101)) - expected)
    documents.append(doc)
target = ROOT / "db/seeds/oops-source.json"
target.write_text(json.dumps(documents, ensure_ascii=False, indent=2) + "\n")
for doc in documents:
    print(doc["id"], len(doc["pages"]), "pages", len(doc.get("questions", [])), "questions", len(doc.get("answers", [])), "source answers")
