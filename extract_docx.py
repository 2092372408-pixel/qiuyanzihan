import zipfile
import xml.etree.ElementTree as ET
import os
import sys

def extract_docx(docx_path, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    with zipfile.ZipFile(docx_path) as z:
        # Extract text
        xml_content = z.read('word/document.xml')
        root = ET.fromstring(xml_content)
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        # We need to maintain some structure if possible, joining by paragraphs
        text_content = []
        for p in root.findall('.//w:p', ns):
            para_text = "".join([node.text for node in p.findall('.//w:t', ns) if node.text])
            if para_text.strip():
                text_content.append(para_text)
                
        with open(os.path.join(out_dir, 'resume_text.txt'), 'w', encoding='utf-8') as f:
            f.write("\n".join(text_content))
            
        # Extract media (images)
        media_dir = os.path.join(out_dir, 'images')
        os.makedirs(media_dir, exist_ok=True)
        for item in z.namelist():
            if item.startswith('word/media/'):
                filename = os.path.basename(item)
                if filename:
                    with open(os.path.join(media_dir, filename), 'wb') as f:
                        f.write(z.read(item))

if __name__ == "__main__":
    extract_docx(sys.argv[1], sys.argv[2])
