from flask import Flask, request, send_file
from flask_cors import CORS
import PyPDF2
import os

app = Flask(__name__)
CORS(app)

@app.route('/delete_pages', methods=['POST'])
def delete_pages():
    data = request.json
    input_path = data['input_path']
    pages_to_delete = data['pages_to_delete']
    output_path = 'C:/Users/amanp/Desktop/self study material/semester/sem 4/embeed system/emeed study/modified.pdf'
    
    with open(input_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        total_pages = len(reader.pages)
        writer = PyPDF2.PdfWriter()
        
        for page_number in range(total_pages):
            if page_number+1 not in pages_to_delete:
                writer.add_page(reader.pages[page_number])
                
        with open(output_path, 'wb') as output_file:
            writer.write(output_file)
            
    return send_file(output_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
