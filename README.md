# Social-Media API

A RESTful API for a social media platform, enabling user authentication, profile management, posts, comments, likes, friendships, and OTP-based password reset functionality.

## Table of Contents
- [Features](#features)
- [API Endpoints](#api-endpoints)
  - [Authentication Routes](#authentication-routes)
  - [User Profile Routes](#user-profile-routes)
  - [Post Routes](#post-routes)
  - [Comment Routes](#comment-routes)
  - [Like Routes](#like-routes)
  - [Friendship Routes](#friendship-routes)
  - [OTP Routes](#otp-routes)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Contributing](#contributing)
- [License](#license)

## Features
- User authentication and session management.
- CRUD operations for user profiles, posts, and comments.
- Like/unlike functionality for posts and comments.
- Friendship management with pending requests.
- OTP-based password reset system.

## API Endpoints

### Authentication Routes
- `POST /api/users/signup`: Register a new user account.
- `POST /api/users/signin`: Log in as a user.
- `POST /api/users/logout`: Log out the currently logged-in user.
- `POST /api/users/logout-all-devices`: Log out the user from all devices.

### User Profile Routes
- `GET /api/users/get-details/:userId`: Retrieve user information (excluding sensitive data like passwords).
- `GET /api/users/get-all-details`: Retrieve information for all users (excluding sensitive credentials like passwords).
- `PUT /api/users/update-details/:userId`: Update user details securely.

### Post Routes
- `GET /api/posts/all`: Retrieve all posts to compile a news feed.
- `GET /api/posts/:postId`: Retrieve a specific post by ID.
- `GET /api/posts/:userId`: Retrieve all posts for a specific user to display on their profile page.
- `POST /api/posts/`: Create a new post.
- `DELETE /api/posts/:postId`: Delete a specific post.
- `PUT /api/posts/:postId`: Update a specific post.

### Comment Routes
- `GET /api/comments/:postId`: Get comments for a specific post.
- `POST /api/comments/:postId`: Add a comment to a specific post.
- `DELETE /api/comments/:commentId`: Delete a specific comment.
- `PUT /api/comments/:commentId`: Update a specific comment.

### Like Routes
- `GET /api/likes/:id`: Get likes for a specific post or comment.
- `POST /api/likes/toggle/:id`: Toggle like on a post or comment.

### Friendship Routes
- `GET /api/friends/get-friends/:userId`: Get a user's friends.
- `GET /api/friends/get-pending-requests`: Get pending friend requests.
- `POST /api/friends/toggle-friendship/:friendId`: Toggle friendship with another user.
- `POST /api/friends/response-to-request/:friendId`: Accept or reject a friend request.

### OTP Routes
- `POST /api/otp/send`: Send an OTP for password reset.
- `POST /api/otp/verify`: Verify an OTP.
- `POST /api/otp/reset-password`: Reset the user's password.

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## Setup and Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/hdebasish/Postaway.git
   cd Postaway
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file and add the following:
     ```env
     PORT=5000
     DB_URL=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     EMAIL_PASSWORD=your_email_password
     ```
4. Start the server:
   ```bash
   npm start
   ```
5. Access the API at `http://localhost:5000`.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
