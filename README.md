This is a backend app to help manage cafetaria, also serves as a part of GAMATECHA's test

This app use PostgreSQL as the database. 

GitHub link: https://github.com/Choi-R/cafetaria
The link to the Postman documentation is: https://documenter.getpostman.com/view/11327521/2sAXqtb1fM
Currently live on: 

# Preparation
Make a .env file containing these:
```
NODE_ENV = 'development' #[development, test, production]
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=cafetaria
PORT=3000
```
After that, run ```npx sequelize-cli db:migrate``` (assuming sequelize-cli is already installed)

# How to Run
Input ```npm start``` in the terminal