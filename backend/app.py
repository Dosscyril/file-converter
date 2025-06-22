from flask import Flask, request, jsonify
from PIL import Image
import os
from flask_cors import CORS
from flask import send_from_directory
from io import BytesIO
from pdf2image import convert_from_bytes
from docx2pdf import convert
import tempfile
from werkzeug.utils import secure_filename
import uuid
from docx2pdf import convert
import fitz
from docx import Document
app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'message': 'No image part in request'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    try:
        img = Image.open(file)
        new_width = int(img.width * 0.5)
        new_height = int(img.height * 0.5)
        img = img.resize((new_width, new_height), Image.LANCZOS)
        save_path = os.path.join(UPLOAD_FOLDER, file.filename)
        img.save(save_path)
        return jsonify({'message': f'Image compressed and saved as {file.filename}'}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()  # This will print full error in console
        return jsonify({'message': 'Error processing image', 'error': str(e)}), 500
@app.route('/uploads/<filename>')
def download_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)
@app.route('/increase-image', methods=['POST'])
def increase_image():
    if 'image' not in request.files:
        return jsonify({'message': 'No image part in request'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    try:
        file_bytes = file.read()
        img = Image.open(BytesIO(file_bytes))
        new_width = int(img.width * 2)
        new_height = int(img.height * 2)
        img = img.resize((new_width, new_height), Image.LANCZOS)
        new_filename = f"enlarged_{file.filename}"
        save_path = os.path.join(UPLOAD_FOLDER, new_filename)
        img.save(save_path)
        return jsonify({'message': f'Image enlarged and saved as {new_filename}', 'filename': new_filename}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'message': 'Error processing image', 'error': str(e)}), 500
@app.route('/pdf-to-jpeg', methods=['POST'])
def pdf_to_jpeg():
    if 'pdf' not in request.files:
        return jsonify({'message': 'No PDF part in request'}), 400
    file = request.files['pdf']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    try:
        images = convert_from_bytes(file.read())
        saved_filenames = []
        for i, image in enumerate(images):
            filename = f"{os.path.splitext(file.filename)[0]}_page_{i + 1}.jpg"
            save_path = os.path.join(UPLOAD_FOLDER, filename)
            image.save(save_path, 'JPEG')
            saved_filenames.append(filename)
        return jsonify({
            'message': 'PDF converted to JPEG(s) successfully',
            'filenames': saved_filenames
        }), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'message': 'Error converting PDF', 'error': str(e)}), 500
@app.route('/jpeg-to-pdf', methods=['POST'])
def jpeg_to_pdf():
    if 'images' not in request.files:
        return jsonify({'message': 'No images part in the request'}), 400
    files = request.files.getlist('images')
    if not files or len(files) == 0:
        return jsonify({'message': 'No images uploaded'}), 400
    try:
        image_list = []
        for file in files:
            img = Image.open(file).convert('RGB')
            image_list.append(img)
        pdf_filename = "converted_pdf.pdf"
        pdf_path = os.path.join(UPLOAD_FOLDER, pdf_filename)
        image_list[0].save(pdf_path, save_all=True, append_images=image_list[1:])
        return jsonify({'message': f'PDF generated as {pdf_filename}', 'filename': pdf_filename}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'message': 'Error processing images', 'error': str(e)}), 500
@app.route('/word-to-pdf', methods=['POST'])
def word_to_pdf():
    if 'word' not in request.files:
        return jsonify({'message': 'No Word file part in request'}), 400
    file = request.files['word']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    try:
        filename = secure_filename(file.filename)
        temp_dir = tempfile.mkdtemp()
        word_path = os.path.join(temp_dir, filename)
        file.save(word_path)
        pdf_filename = os.path.splitext(filename)[0] + '.pdf'
        pdf_path = os.path.join(UPLOAD_FOLDER, pdf_filename)
        convert(word_path, pdf_path)
        return jsonify({'message': f'Word converted to PDF successfully', 'filename': pdf_filename}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'message': 'Error converting Word to PDF', 'error': str(e)}), 500
ALLOWED_WORD_EXTENSIONS = {'doc', 'docx'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_WORD_EXTENSIONS
@app.route('/word-to-pdf', methods=['POST'])
def word_to_pdf():
    if 'word' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['word']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        base_name = str(uuid.uuid4())
        docx_path = os.path.join(UPLOAD_FOLDER, f"{base_name}.docx")
        pdf_path = os.path.join(UPLOAD_FOLDER, f"{base_name}.pdf")
        file.save(docx_path)
        try:
            convert(docx_path, pdf_path)
            return jsonify({
                'message': 'Conversion successful',
                'filename': f"{base_name}.pdf"
            }), 200
        except Exception as e:
            return jsonify({'message': f'Conversion failed: {str(e)}'}), 500
    else:
        return jsonify({'message': 'Invalid file format. Upload a .doc or .docx file.'}), 400
ALLOWED_PDF_EXTENSIONS = {'pdf'}
def allowed_pdf_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_PDF_EXTENSIONS
@app.route('/pdf-to-word', methods=['POST'])
def pdf_to_word():
    if 'pdf' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['pdf']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    if file and allowed_pdf_file(file.filename):
        filename = secure_filename(file.filename)
        base_name = str(uuid.uuid4())
        pdf_path = os.path.join(UPLOAD_FOLDER, f"{base_name}.pdf")
        docx_path = os.path.join(UPLOAD_FOLDER, f"{base_name}.docx")
        file.save(pdf_path)
        try:
            pdf_doc = fitz.open(pdf_path)
            full_text = ""
            for page in pdf_doc:
                full_text += page.get_text()
            doc = Document()
            doc.add_paragraph(full_text)
            doc.save(docx_path)
            return jsonify({
                'message': 'Conversion successful',
                'filename': f"{base_name}.docx"
            }), 200
        except Exception as e:
            return jsonify({'message': f'Conversion failed: {str(e)}'}), 500
    else:
        return jsonify({'message': 'Invalid file format. Upload a .pdf file.'}), 400
if __name__ == '__main__':
    app.run(debug=True)
