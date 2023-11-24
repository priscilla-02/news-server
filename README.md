# Priscilla's News Server API

## Project Summary:

Welcome! The project establishes an API connected to a comprehensive database of news-related items. The dataset encompasses articles, topics, users, and comments. Users can interact with this data through the hosted API, which features various endpoints set up using the GET method as detailed in the app.js file. Additionally, the API supports functionality for posting and deleting comments, along with a patch route to update the vote count for a specific article. Comprehensive documentation is available by requesting the endpoint "/api".

Hosted Version: https://news-project-gpvj.onrender.com

## Dependencies:

- Node.js (v 14.0.0 or above)
- PostgreSQL (v 14.8 or above)

## Setup Instructions:

**1. Clone the Repository:**

```
   git clone https://github.com/priscilla-02/news-server
```

**2. Install Dependencies:**

- dependencies

```
   npm install dotenv
   npm install express
   npm install fs.promises
   npm install pg
```

- devDependencies

```
npm install husky --save-dev
npm install jest --save-dev
npm install dotenv --save-dev
npm install pg-format --save-dev
npm install supertest --save-dev
```

**3. Set Up Environment Variables:**

- dependencies
  Create three .env files in the project root: ".env.development", ".env.test" and ".env.production". Populate them with the required environment variables as below.
  .env.test (PGDATABASE=nc_news_test)
  .env.development (PGDATABASE=nc_news)
  .env.production (DATABASE_URL=postgres://foozyjiv:kIG9gVrxChWKsEX6wJJpEye7qmeS_XiO@flora.db.elephantsql.com/foozyjiv)

- Ensured the above files are .gitignore

**4. Seed the Local Database**

```
npm run setup-dbs
npm run seed
```

**5.Add jest to package.json file**

```
"jest": {
"setupFilesAfterEnv": [
"jest-extended/all", "jest-sorted"
]
}
```

**6.Run Test:**

```
npm test
```
