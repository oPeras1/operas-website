# Hugo Pereira's Personal Website

This repository contains the source code for Hugo Pereira's personal website ecosystem, including the main portfolio site, blog, and contact mail service.

## Live Websites

- **Main Portfolio**: [operas.pt](https://operas.pt) - Personal portfolio and CV
- **Blog**: [blog.operas.pt](https://blog.operas.pt) - Personal blog with thoughts and experiments
- **Contact Service**: [mail.operas.pt](https://mail.operas.pt) - Contact form backend service

## Project Structure

```
├── operas.pt/              # Main portfolio website
│   ├── index.html          # Portfolio homepage
│   ├── style.css           # Main styles
│   └── script.js           # Interactive functionality
├── blog.operas.pt/         # Personal blog
│   ├── index.html          # Blog homepage
│   ├── style.css           # Blog styles
│   ├── script.js           # Blog functionality
│   └── blog-post/          # Blog post components
│       ├── blog-post.html
│       ├── blog-post.css
│       ├── blog-post.js
│       └── blog-posts.json
├── mail.operas.pt/         # Contact form backend service
│   ├── main.py             # Flask application
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Container configuration
└── docker-compose.yml     # Multi-service orchestration
```

## Getting Started

### Prerequisites

- Docker

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/oPeras1/operas-website.git
   cd operas-website
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your SMTP configuration
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Access the services**
   - Main portfolio: http://localhost:4080
   - Blog: http://localhost:4081
   - Mail service: http://localhost:4082

## Services

### Main Portfolio (operas.pt)
- **Port**: 4080
- **Technology**: Static HTML/CSS/JavaScript
- **Description**: Personal portfolio showcasing CV, skills, and contact information
- **Server**: Nginx (Alpine)

### Blog (blog.operas.pt)
- **Port**: 4081
- **Technology**: Static HTML/CSS/JavaScript with JSON data
- **Description**: Personal blog featuring thoughts, experiments, and technical articles
- **Server**: Nginx (Alpine)

### Mail Service (mail.operas.pt)
- **Port**: 4082
- **Technology**: Flask (Python)
- **Description**: Backend service for handling contact form submissions
- **Features**:
  - CORS enabled for operas.pt domain
  - SMTP email forwarding
  - Input validation and sanitization
  - Environment-based configuration

## Configuration

### Environment Variables (.env)

```env
SMTP_SERVER=your.smtp.server.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-app-password
RECIPIENT_EMAIL=recipient@domain.com
PORT=8080
```

## Security

- CORS protection limiting access to operas.pt domain
- Input validation on contact forms
- Environment-based secret management through GitHub Secrets
- Containerized services for isolation

## Blog Management

Blog posts are managed through the `blog-posts.json` file. To add a new post:

1. Add entry to `blog.operas.pt/blog-post/blog-posts.json`
2. Follow the existing JSON structure
3. The blog automatically displays new posts

## Development

### Adding New Features

1. **Frontend changes**: Edit files in respective directories
2. **Backend changes**: Modify `mail.operas.pt/main.py`
3. **Styling**: Update CSS files in each service directory
4. **Dependencies**: Update `requirements.txt` for Python dependencies

### Local Testing

```bash
# Test individual services
docker-compose up operas          # Main site only
docker-compose up blog-operas     # Blog only
docker-compose up mail-operas     # Mail service only

# View logs
docker-compose logs -f [service-name]
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

This is a personal website project, but feel free to fork it for your own use.

---

*Built with ❤️ by Hugo Pereira*
