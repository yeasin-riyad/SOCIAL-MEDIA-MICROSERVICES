# 🚀 Social Media App — Microservices Architecture

> A scalable **Social Media Application** built with **Node.js, Express.js, Redis, RabbitMQ, and Microservices Architecture**.

![Microservices](https://img.shields.io/badge/Architecture-Microservices-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge\&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-API-black?style=for-the-badge\&logo=express)
![Redis](https://img.shields.io/badge/Redis-Caching-red?style=for-the-badge\&logo=redis)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Message%20Queue-orange?style=for-the-badge\&logo=rabbitmq)

---

## 📌 Overview

This project is a **production-style Social Media Application** designed using a **Microservices Architecture**.

Instead of building one large monolithic backend, the application is divided into multiple independent services. Each service has a **single responsibility**, its own business logic, and can be developed, deployed, and scaled independently.

### 🎯 Main Goals

* Learn real-world Microservices Architecture
* Build scalable REST APIs with Node.js and Express.js
* Understand API Gateway patterns
* Implement authentication and identity management
* Build independent Post and Search services
* Use Redis for caching and fast data access
* Use RabbitMQ for asynchronous communication
* Understand service-to-service communication
* Design scalable and maintainable backend systems

---

# 🏗️ System Architecture

```text
                         ┌───────────────────┐
                         │     Client App     │
                         │ Web / Mobile App   │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │    API Gateway    │
                         │                   │
                         │ Routing           │
                         │ Authentication    │
                         │ Rate Limiting     │
                         └───────┬───────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
      ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
      │   Identity   │   │     Post     │   │    Search    │
      │   Service    │   │   Service    │   │   Service    │
      └──────────────┘   └──────┬───────┘   └──────────────┘
                                 │
                                 ▼
                         ┌───────────────────┐
                         │    Message Queue   │
                         │     RabbitMQ       │
                         └─────────┬─────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
             ┌────────────┐ ┌────────────┐ ┌────────────┐
             │   Search   │ │   Media    │ │   Message  │
             │   Events   │ │   Service   │ │   Service  │
             └────────────┘ └────────────┘ └────────────┘

                         ┌───────────────────┐
                         │       Redis       │
                         │ Cache / Sessions  │
                         │ Rate Limiting     │
                         └───────────────────┘
```

---

# 🧩 Microservices

## 1️⃣ API Gateway Service

The **API Gateway** is the single entry point for clients.

Instead of allowing the client to communicate directly with every microservice, requests first go through the API Gateway.

### Responsibilities

* Request routing
* Authentication verification
* Authorization
* Rate limiting
* Request validation
* Centralized error handling
* Service discovery
* Request logging

### Example

```text
Client
   │
   │ GET /api/posts
   ▼
API Gateway
   │
   │ Forward request
   ▼
Post Service
```

---

# 🔐 2️⃣ Identity Service

Responsible for authentication and user identity management.

### Responsibilities

* User registration
* User login
* Logout
* Password hashing
* JWT authentication
* Token validation
* User profile
* Authorization
* Role management

### Example APIs

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
GET  /api/users/:id
```

---

# 📝 3️⃣ Post Service

Responsible for everything related to social media posts.

### Responsibilities

* Create posts
* Get posts
* Update posts
* Delete posts
* Like / unlike posts
* Comments
* Post ownership
* Pagination
* Feed generation

### Example APIs

```http
POST   /api/posts
GET    /api/posts
GET    /api/posts/:id
PATCH  /api/posts/:id
DELETE /api/posts/:id

POST   /api/posts/:id/like
POST   /api/posts/:id/comments
```

### Example Flow

```text
User
 │
 ▼
API Gateway
 │
 ▼
Post Service
 │
 ├── Save Post
 │
 └── Publish "PostCreated" event
          │
          ▼
       RabbitMQ
```

---

# 🔎 4️⃣ Search Service

The Search Service handles searching users, posts, hashtags, and other content.

### Responsibilities

* Search posts
* Search users
* Hashtag search
* Full-text search
* Search indexing
* Ranking search results

### Example

```http
GET /api/search?q=nodejs
GET /api/search/users?q=yeasin
GET /api/search/posts?q=microservices
```

The Search Service can consume events from RabbitMQ.

```text
Post Service
     │
     │ PostCreated
     ▼
  RabbitMQ
     │
     ▼
Search Service
     │
     ▼
Update Search Index
```

This keeps the Post Service independent from the search infrastructure.

---

# 🔍 5️⃣ Search Service

> **Purpose:** Maintain a separate, optimized system for searching application data.

Possible technologies:

* PostgreSQL Full-Text Search
* Elasticsearch
* OpenSearch

### Example Event

```json
{
  "event": "PostCreated",
  "data": {
    "postId": "123",
    "authorId": "456",
    "content": "Learning Microservices with Node.js"
  }
}
```

The Search Service consumes this event and updates its search index asynchronously.

---

# 💬 6️⃣ Message Service

The Message Service handles communication between users.

### Responsibilities

* Direct messages
* Conversations
* Message history
* Online/offline status
* Message delivery
* Notifications
* Real-time communication

### Example APIs

```http
POST /api/conversations
GET  /api/conversations
GET  /api/conversations/:id/messages
POST /api/conversations/:id/messages
```

For real-time communication, this service can use:

```text
WebSocket
     │
     ▼
Message Service
     │
     ▼
RabbitMQ
```

---

# 📨 7️⃣ Message Queue Service

The system uses **RabbitMQ** for asynchronous communication between services.

Instead of tightly coupling services together, one service can publish an event and other services can consume it.

### Example

```text
Post Service
     │
     │ Publish Event
     ▼
  RabbitMQ
     │
     ├──────────────► Search Service
     │
     ├──────────────► Notification Service
     │
     └──────────────► Analytics Service
```

### Possible Events

```text
UserRegistered
UserUpdated

PostCreated
PostUpdated
PostDeleted

PostLiked
CommentCreated

MessageSent
MediaUploaded
```

### Why RabbitMQ?

* Asynchronous processing
* Loose coupling
* Reliable message delivery
* Event-driven architecture
* Better scalability
* Background job processing

---

# 🖼️ 8️⃣ Media Service

The Media Service handles user-uploaded files.

### Responsibilities

* Image upload
* Video upload
* File validation
* File metadata
* Image processing
* Video processing
* Storage management
* Media deletion

Possible storage:

```text
Client
  │
  ▼
API Gateway
  │
  ▼
Media Service
  │
  ▼
Object Storage
```

Possible object storage solutions:

* AWS S3
* Cloudinary
* MinIO

---

# ⚡ Redis

Redis is used as a **fast in-memory data store**.

It can improve application performance by avoiding unnecessary database queries.

### Redis Use Cases

* API caching
* Session storage
* Rate limiting
* Temporary data
* Online user presence
* Feed caching
* Token/session management
* Distributed locks

### Cache Flow

```text
Client
  │
  ▼
API Gateway
  │
  ▼
Post Service
  │
  ▼
Redis
  │
  ├── Cache Hit ──────► Return Data
  │
  └── Cache Miss
          │
          ▼
       Database
          │
          ▼
        Redis
          │
          ▼
      Return Data
```

---

# 🟢 Node.js Concepts

This project focuses heavily on important Node.js backend concepts.

### Topics

* Node.js Runtime
* Event Loop
* Asynchronous Programming
* Promises
* Async/Await
* Event Emitters
* Streams
* Buffers
* Error Handling
* Environment Variables
* Modular Architecture
* Process Management
* Graceful Shutdown

### Event Loop

```text
JavaScript
    │
    ▼
 Node.js
    │
    ▼
 Event Loop
    │
    ├── Timers
    ├── I/O
    ├── Poll
    ├── Check
    └── Microtasks
```

Understanding the Event Loop is essential for building high-performance Node.js services.

---

# 🚂 Express.js

Express.js is used to build REST APIs for the microservices.

### Core Concepts

* Routing
* Middleware
* Controllers
* Services
* Request / Response
* Error Handling
* Authentication Middleware
* Validation
* API Versioning
* HTTP Status Codes
* REST API Design

### Recommended Structure

```text
src/
├── config/
├── controllers/
├── middlewares/
├── routes/
├── services/
├── repositories/
├── utils/
├── events/
├── validators/
├── app.js
└── server.js
```

---

# 🌐 API Design

The project follows RESTful API design principles.

### Example API Structure

```text
/api/v1/auth
/api/v1/users
/api/v1/posts
/api/v1/comments
/api/v1/search
/api/v1/messages
/api/v1/media
```

### HTTP Methods

| Method | Purpose       |
| ------ | ------------- |
| GET    | Retrieve data |
| POST   | Create data   |
| PUT    | Replace data  |
| PATCH  | Update data   |
| DELETE | Delete data   |

### HTTP Status Codes

```text
200 → OK
201 → Created
204 → No Content
400 → Bad Request
401 → Unauthorized
403 → Forbidden
404 → Not Found
409 → Conflict
429 → Too Many Requests
500 → Internal Server Error
```

---

# 🔄 Communication Patterns

Microservices can communicate using different patterns.

## Synchronous Communication

```text
API Gateway
     │
     │ HTTP Request
     ▼
Post Service
     │
     ▼
Response
```

Useful when the client needs an immediate response.

---

## Asynchronous Communication

```text
Post Service
     │
     │ Event
     ▼
RabbitMQ
     │
     ▼
Search Service
```

Useful for background tasks and event-driven workflows.

---

# 🔥 Example: Creating a Post

```text
                    ┌─────────────┐
                    │    Client   │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ API Gateway │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Post Service│
                    └──────┬──────┘
                           │
                  ┌────────┴────────┐
                  │                 │
                  ▼                 ▼
              Database          RabbitMQ
                                    │
                     ┌──────────────┼──────────────┐
                     ▼              ▼              ▼
                  Search         Media       Notification
                  Service        Service         Service
```

The Post Service does not need to directly call every other service.

This creates a **loosely coupled architecture**.

---

# 🛡️ Security

Security is an important part of the architecture.

### Security Features

* JWT Authentication
* Password Hashing
* Input Validation
* Authorization
* Rate Limiting
* CORS
* HTTP Security Headers
* Secure Cookies
* Environment Variables
* Request Sanitization
* API Gateway Protection

Example:

```text
Client
  │
  ▼
API Gateway
  │
  ├── Rate Limit
  ├── Validate Token
  ├── Validate Request
  └── Forward Request
          │
          ▼
      Microservice
```

---

# 📦 Suggested Project Structure

```text
social-media-microservices/
│
├── api-gateway/
│   ├── src/
│   └── package.json
│
├── identity-service/
│   ├── src/
│   └── package.json
│
├── post-service/
│   ├── src/
│   └── package.json
│
├── search-service/
│   ├── src/
│   └── package.json
│
├── message-service/
│   ├── src/
│   └── package.json
│
├── media-service/
│   ├── src/
│   └── package.json
│
├── infrastructure/
│   └── docker-compose.yml
│
└── README.md
```

---

# 🐳 Infrastructure

Docker can be used to run the infrastructure locally.

```text
Docker Compose
│
├── PostgreSQL
├── Redis
├── RabbitMQ
└── Microservices
```

Example infrastructure:

```text
┌─────────────────────────────────────────┐
│              Docker Network             │
│                                         │
│  ┌───────────┐      ┌──────────────┐   │
│  │ PostgreSQL│      │    Redis     │   │
│  └───────────┘      └──────────────┘   │
│                                         │
│  ┌───────────┐      ┌──────────────┐   │
│  │ RabbitMQ  │      │ Microservices│   │
│  └───────────┘      └──────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

# 🧠 Key Concepts Learned

### Microservices

* Service decomposition
* Single Responsibility
* Independent deployment
* Service boundaries
* Loose coupling
* Fault isolation

### Node.js

* Event Loop
* Async programming
* Event-driven architecture
* Streams
* Error handling

### Express.js

* REST APIs
* Middleware
* Routing
* Controllers
* Validation
* Error handling

### Redis

* In-memory storage
* Caching
* TTL
* Rate limiting
* Sessions
* Pub/Sub

### RabbitMQ

* Producers
* Consumers
* Exchanges
* Queues
* Routing keys
* Acknowledgements
* Event-driven architecture

### API Gateway

* Request routing
* Authentication
* Rate limiting
* Centralized entry point

---

# 📚 Learning Roadmap

```text
Node.js
   │
   ▼
Express.js
   │
   ▼
REST API Design
   │
   ▼
Redis
   │
   ▼
RabbitMQ
   │
   ▼
Microservices
   │
   ▼
API Gateway
   │
   ▼
Event-Driven Architecture
   │
   ▼
Docker
   │
   ▼
Scalable Backend System
```

---

# 🎯 Project Objectives

By completing this project, the goal is to understand how modern backend systems are designed beyond a simple CRUD application.

You will learn how to:

* Design a distributed backend
* Split a large application into services
* Build independent Node.js services
* Design production-style REST APIs
* Implement authentication
* Cache frequently accessed data
* Process asynchronous jobs
* Communicate between services
* Build event-driven systems
* Handle service failures
* Scale individual services independently

---

# 🚀 Future Improvements

* [ ] Dockerize all microservices
* [ ] Add PostgreSQL databases
* [ ] Implement JWT authentication
* [ ] Add Redis caching
* [ ] Add Redis-based rate limiting
* [ ] Implement RabbitMQ events
* [ ] Add WebSocket messaging
* [ ] Add media upload
* [ ] Add search indexing
* [ ] Add API documentation with Swagger
* [ ] Add centralized logging
* [ ] Add health-check endpoints
* [ ] Add automated tests
* [ ] Add CI/CD pipeline
* [ ] Deploy services independently
* [ ] Add monitoring and observability

---

# 🛠️ Tech Stack

| Technology     | Purpose                 |
| -------------- | ----------------------- |
| **Node.js**    | Backend Runtime         |
| **Express.js** | REST API Framework      |
| **PostgreSQL** | Primary Database        |
| **Redis**      | Cache & Fast Data Store |
| **RabbitMQ**   | Message Broker          |
| **JWT**        | Authentication          |



---

# 💡 Architecture Philosophy

> **Keep services small, independent, loosely coupled, and responsible for one business capability.**

The main idea of this project is not simply to create a social media application.

It is to understand **how large-scale backend systems communicate, scale, cache, process events, and remain maintainable as the system grows.**

---

## 👨‍💻 Author

**Md. Yeasin Mazumder**

🚀 Backend Developer | Full-Stack Enthusiast | Problem Solver

---

⭐ If you find this project useful, consider giving it a **star** and following the learning journey!
