import zipfile
import xml.etree.ElementTree as ET
import sys
import os

def read_docx(path):
    try:
        with zipfile.ZipFile(path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            paragraphs = []
            for node in tree.iter():
                if node.tag.endswith('}p'):
                    texts = [n.text for n in node.iter() if n.tag.endswith('}t') and n.text]
                    if texts:
                        paragraphs.append(''.join(texts))
            return '\n'.join(paragraphs)
    except Exception as e:
        return f"Error reading docx: {e}"

print("Extracting DOCX...")
with open("Lets_Explore_Research_Paper.txt", "w", encoding="utf-8") as f:
    f.write(read_docx("Lets_Explore_Research_Paper.docx"))

try:
    import pypdf
except ImportError:
    print("Installing pypdf...")
    os.system("python -m pip install pypdf")
    import pypdf

print("Extracting journal_jics_22-4_1570945319.pdf...")
try:
    reader = pypdf.PdfReader("journal_jics_22-4_1570945319.pdf")
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"
    with open("journal_jics_22-4.txt", "w", encoding="utf-8") as f:
        f.write(text)
except Exception as e:
    print(f"Error reading journal PDF: {e}")

print("Extracting travel_and_tourism_website.pdf...")
try:
    reader = pypdf.PdfReader("travel_and_tourism_website.pdf")
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"
    with open("travel_and_tourism_website.txt", "w", encoding="utf-8") as f:
        f.write(text)
except Exception as e:
    print(f"Error reading travel PDF: {e}")

print("Extraction complete.")
