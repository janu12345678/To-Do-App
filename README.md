This is a user-friendly To-Do List Web Application built with Node.js, Express, MongoDB, and EJS. 
The application allows users to register, log in, and manage their tasks effectively. Tasks are stored on a per-user basis, ensuring personalized task management.
**Features**
1) User Authentication:
    => Users can register and log in securely using email and password.
    => Passwords are hashed using bcrypt for secure storage.
    => Authentication is managed via JWT (JSON Web Tokens) for session handling.

2) Task Management:
    => Add Tasks: Users can create tasks, which are tied to their accounts.
    => View Tasks: Tasks are displayed dynamically on the user's profile page.
    => Edit Tasks: Users can update task names.
    => Mark as Complete: Tasks can be marked as complete or incomplete.
    => Delete Tasks: Users can remove tasks they no longer need.

3) Protected Routes:
To ensure the security and privacy of user data, certain routes in the application are protected and can only be accessed by authenticated users.
This is implemented using a custom middleware function called isLoggedIn.
/profile: Displays the user's task list and allows interaction with their personalized to-do list. Only accessible if the user is authenticated.

5) Dynamic UI:
Views are rendered using EJS, with data dynamically passed from the server.
