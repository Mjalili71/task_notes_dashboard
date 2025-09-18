# Task Notes Dashboard

A modern FastAPI backend for managing Tasks and Notes with full CRUD operations.

## 🚀 Features

- ✅ **Task Management** - Create, read, update, delete tasks with priority levels
- 📝 **Note Taking** - Manage notes with title and content
- 🔗 **User Ready** - Database schema ready for user authentication
- 📚 **Auto Documentation** - Interactive Swagger UI at `/docs`
- 🗄️ **SQLite Database** - Easy setup with automatic table creation
- ⚡ **Fast API** - Built with FastAPI for high performance

## 🛠️ Tech Stack

- **FastAPI** - Modern web framework
- **SQLAlchemy** - Database ORM
- **Pydantic** - Data validation
- **SQLite** - Database (easily switchable to PostgreSQL)
- **Uvicorn** - ASGI server

## 📦 Installation

### Prerequisites
- Python 3.12+
- Git

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd task_notes_dashboard
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Run the application**
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🔗 API Endpoints

### Health Check
- `GET /` - Welcome message
- `GET /health` - Health status

### Tasks
- `GET /tasks/` - Get all tasks
- `GET /tasks/{id}` - Get specific task
- `POST /tasks/` - Create new task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

### Notes
- `GET /notes/` - Get all notes
- `GET /notes/{id}` - Get specific note
- `POST /notes/` - Create new note
- `PUT /notes/{id}` - Update note
- `DELETE /notes/{id}` - Delete note

## 💡 Usage Examples

### Create a Task
```bash
curl -X POST "http://localhost:8000/tasks/" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the Task Notes Dashboard",
    "priority": "high",
    "completed": false
  }'
```

### Create a Note
```bash
curl -X POST "http://localhost:8000/notes/" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meeting Notes",
    "content": "Discussed project timeline and requirements"
  }'
```

### Get All Tasks
```bash
curl "http://localhost:8000/tasks/"
```

## 🗄️ Database Schema

### Tasks Table
- `id` - Primary key
- `title` - Task title (required)
- `description` - Task description (optional)
- `completed` - Boolean status
- `priority` - Enum: low, medium, high
- `due_date` - Due date (optional)
- `user_id` - Foreign key to users (optional)
- `created_at` - Auto timestamp
- `updated_at` - Auto timestamp

### Notes Table
- `id` - Primary key
- `title` - Note title (optional)
- `content` - Note content (required)
- `user_id` - Foreign key to users (optional)
- `created_at` - Auto timestamp
- `updated_at` - Auto timestamp

### Users Table (Ready for Auth)
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `hashed_password` - Encrypted password
- `is_active` - User status
- `created_at` - Auto timestamp
- `updated_at` - Auto timestamp

## 🚀 Future Enhancements

- [ ] JWT Authentication
- [ ] User registration and login
- [ ] PostgreSQL support
- [ ] Task categories and tags
- [ ] Due date reminders
- [ ] API rate limiting
- [ ] Docker containerization
- [ ] Unit tests with pytest

## 📝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contact

Mahdieh jalili- m.jallili183@gmail.com
Project Link: [https://github.com/Mjalili71/task_notes_dashboard](https://github.com/Mjalili71/task_notes_dashboard)
