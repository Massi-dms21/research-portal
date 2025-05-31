# Research Portal

This full-stack web application is built using React.js, Spring Boot, Material UI, and Axios,
and serves as a comprehensive research management portal with role-based login functionality for users, researchers, and administrators,directors vice rctors and team leads.
The backend defines a structured relational schema where users are associated with teams, teams have leads, and researchers can be linked to research projects, scientific productions, laboratories, rooms, and material resources;
rooms are tied to laboratories, and each material resource is tied to a specific room.
Scientific productions are associated with both authors (users) and their corresponding research projects.
The application allows authenticated users to manage research data, publish scientific outputs, and allocate physical resources through an intuitive frontend built with Material UI and powered by Axios-based REST API communication.
To run the application, navigate to the `frontend` directory and run `npm install` followed by `npm start`, and for the backend, go to the backend project folder  and execute `backendapp`.
