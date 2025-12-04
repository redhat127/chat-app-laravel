# Chat App - Laravel + Inertia (react)

A modern real-time chat application built with Laravel, providing seamless communication between users with real-time messaging capabilities.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## Features

- Real-time messaging between users
- User authentication and authorization
- Responsive web interface
- Message history and persistence
- Online/offline user status
- Notification system
- Clean and intuitive UI

## Prerequisites

Before you begin, ensure you have the following installed:

- PHP 8.2 or higher
- Composer
- [Bun](https://bun.sh/docs/installation)
- PostgreSQL database
- Git

## Installation

1. Clone the repository:

```bash
git clone https://github.com/redhat127/chat-app-laravel.git
cd chat-app-laravel
```

2. Install PHP dependencies:

```bash
composer install
```

3. Install JavaScript dependencies:

```bash
bun install
```

4. Create environment configuration file:

```bash
cp .env.example .env
```

5. Generate application key:

```bash
php artisan key:generate
```

6. Create a symbolic link to the storage directory:

```bash
php artisan storage:link
```

## Configuration

1. Update your `.env` file with database credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=chat_app_laravel_db
DB_USERNAME=postgres
DB_PASSWORD=
```

2. Configure broadcasting for real-time features:

```bash
php artisan install:broadcasting
```

When prompted, choose **Reverb** as your broadcasting driver. This will automatically configure the necessary environment variables for real-time messaging.

3. Run database migrations and seed the database:

```bash
php artisan migrate --seed
```

## Usage

1. Compile assets for development:

```bash
bun run dev
```

2. Start the development server:

```bash
php artisan serve
```

3. Start the Reverb broadcasting server (in a separate terminal):

```bash
php artisan reverb:start --debug
```

4. Start the queue listener (in another separate terminal):

```bash
php artisan queue:listen
```

The application will be available at `http://localhost:8000`

## Architecture

The application is structured as follows:

- **Backend**: Laravel framework handles API endpoints, database operations, and business logic
- **Frontend**: React with Inertia.js for server-driven single-page application experience
- **Database**: PostgreSQL stores user information, messages, and conversations
- **Broadcasting**: Real-time events powered by Laravel Reverb

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please open an issue on the GitHub repository.

---

**Happy chatting!** 💬
