## Project Overview

This project implements an Adaptive Testing System using **NestJS** for the backend and **Next.js** for the frontend. The system provides features for user authentication, adaptive test management, and question handling, where question difficulty adjusts based on user performance. The system uses **MongoDB** as the database.

---

## Backend (NestJS)

### Setup

1. **Install dependencies:**
   command: yarn install

2. **Environment Configuration:**
   Create a .env file in the root directory with the following configuration

   1. JWT_SECRET=''
   2. MONGO_URI=''
   3. FRONTEND_BASE_URL='http://localhost:3000'

3. **Install dependencies:**
   command: yarn run start:dev (By Default Server Running on 4000)

4. **Running the seed script:**

   1. Navigate to src/database/seed/question.seed.ts and update <YOUR_MONGO_DB_URL>
   2. command: npm install -g ts-node
   3. command: ts-node src/database/seed/question.seed.ts

5. **API Endpoints:**

   ```
   Auth Apis
      1. POST /auth/users/login
         request body :
            {
             "email": "<email>,
             "secret": "<secret>
            }

      2. POST /auth/admin/login
         request body :
            {
             "email": "<email>,
             "secret": "<secret>
            }

      3. POST /auth/super-admin/login
         request body :
            {
             "email": "<email>,
             "secret": "<secret>
            }

      4. POST /auth/users/register
         request body :
            {
             "fullName": "<fullName>",
             "email": "<email>,
             "secret": "<secret>
            }


   Admin Apis
       5. POST /admin/user (only for super admins)
          request body :
             {
                "fullName": "<fullName>",
                "email": "<email>,
                "secret": "<secret>"
            }
            headers: {authorization: "Bearer <ADMIN_TOKEN>"}

       6. POST /admin/questions
          request body :
             {
              "text": "Solve the integral ∫(e^x * sin(x)) dx.",
              "score": 10,
              "difficulty": 10,
              "options": {
                "A": "e^x * (sin(x) - cos(x)) + C",
                "B": "e^x * (sin(x) + cos(x)) + C",
                "C": "e^x * (sin(x) - cos(x))",
                "D": "e^x * (sin(x) + cos(x))"
              },
              "correctAnswer": "A",
              "weight": 5
            }
         headers: {authorization: "Bearer <ADMIN_TOKEN>"}

       7. PUT /admin/questions/:id
          request body :
             {
              "text": "Solve the integral ∫(e^x * sin(x)) dx.",
              "score": 10,
              "difficulty": 10,
              "options": {
                "A": "e^x * (sin(x) - cos(x)) + C",
                "B": "e^x * (sin(x) + cos(x)) + C",
                "C": "e^x * (sin(x) - cos(x))",
                "D": "e^x * (sin(x) + cos(x))"
              },
              "correctAnswer": "A",
              "weight": 5
            }
         headers: {authorization: "Bearer <ADMIN_TOKEN>"}

       8. GET /admin/questions
         headers: {authorization: "Bearer <ADMIN_TOKEN>"}

       9. GET /admin/questions/:id
         headers: {authorization: "Bearer <ADMIN_TOKEN>"}

       10. DELETE /admin/questions/:id
         headers: {authorization: "Bearer <ADMIN_TOKEN>"}

       11. POST /admin/tests
          request body :
          {
           "title": "General Knowledge Test",
           "questionIds": [
             "66dd894bd1292ee67c5e0a64",
             "66dc4de9d86cd7e735d1232d",
             "66dc4d3ed86cd7e735d1230f",
             "66dc4d85d86cd7e735d12318",
             "66dc4d72d86cd7e735d12312",
             "66dc4db7d86cd7e735d12321",
             "66dc4d7bd86cd7e735d12315",
             "66dc4dced86cd7e735d12327",
             "66dc4ddad86cd7e735d1232a",
             "66dd895dd1292ee67c5e0a67"
           ],
           "deadline": "2024-09-15T23:59:59.000Z"
         }
         headers: {authorization: "Bearer <ADMIN_TOKEN>"}


       8. GET /admin/tests/:id
         headers: {authorization: "Bearer <ADMIN_TOKEN>"}



   User Apis
       1. GET /user/tests/:uniqueUrlId
         headers: {authorization: "Bearer <USER_TOKEN>"}

       2. GET /user/tests/next-question/:testId
         headers: {authorization: "Bearer <USER_TOKEN>"}

       3. POST /user/tests/:testId/start
         headers: {authorization: "Bearer <USER_TOKEN>"}

       4. POST /user/tests/:testId/questions/:questionId/answer
          request body: {
                            "answer": "A"
                        }
         headers: {authorization: "Bearer <USER_TOKEN>"}

   ```

6. **Postman Collection Url:**
   https://api.postman.com/collections/17296470-9c6d72ee-eaac-45db-9b93-58f33cfd978f?access_key=PMAT-01J7C4FC17MVDJKMRM8VTAAJ60
