"""Render original note pages without altering their diagrams or wording."""
import json
from pathlib import Path
import pypdfium2 as pdfium

root = Path(__file__).resolve().parents[1]
folder = root / "public/study/oops/pages"
folder.mkdir(parents=True, exist_ok=True)
document = pdfium.PdfDocument(root / "public/study/oops/notes.pdf")
pages = []
for index in range(len(document)):
    page = document[index]
    bitmap = page.render(scale=2)
    image = bitmap.to_pil()
    image.save(folder / f"{index + 1}.webp", "WEBP", quality=88)
    pages.append({"number": index + 1, "width": image.width, "height": image.height})
    image.close()
    bitmap.close()
    page.close()
(root / "src/content/oops/pages.json").write_text(json.dumps(pages, indent=2) + "\n")
print(f"Preserved {len(pages)} original note pages as images.")
