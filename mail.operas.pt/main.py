from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS
CORS(app, origins=['https://operas.pt'])

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/contact', methods=['POST'])
def contact():
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        name = data['name']
        email = data['email']
        subject = data['subject']
        message = data['message']
        
        # Create email content
        email_body = f"""
            Name: {name}
            Email: {email}

            Message:
            {message}
        """
        
        # Get SMTP configuration from environment
        smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', '587'))
        smtp_user = os.getenv('SMTP_USER')
        smtp_pass = os.getenv('SMTP_PASS')
        recipient_email = os.getenv('RECIPIENT_EMAIL', 'me@operas.pt')
        
        if not smtp_user or not smtp_pass:
            logger.error("SMTP credentials not configured")
            return jsonify({'error': 'SMTP configuration missing'}), 500
        
        # Create email message
        msg = MIMEMultipart()
        msg['From'] = f"{name} <{smtp_user}>"
        msg['To'] = recipient_email
        msg['Subject'] = "me@operas.pt | Contact | " + subject
        msg['Reply-To'] = email
        
        # Attach body to email
        msg.attach(MIMEText(email_body, 'plain'))
        
        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        
        logger.info(f"Email sent successfully from {email}")
        return jsonify({'status': 'Email sent successfully'}), 200
        
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return jsonify({'error': 'Email sending failed'}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

# CORS Fucking shit
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)