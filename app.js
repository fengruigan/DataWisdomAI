const express = require("express");
const path = require("path");
require("dotenv").config();
const OpenAI = require("openai");
const openai = new OpenAI(); // api key is taken from .env file
const mysql = require('mysql');

const app = express();

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "sample"
});

dbConnection.connect((error) => {
  if (error) throw error;
  console.log("DB connected")
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "frontend/build")));

app.get("/", async (req, res) => {
  const prompt = "Top 2 agents based on closed amount"
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant designed to output SQL Queries in Json format of the form {sql: 'query'}.",
      },
      { role: "user", content: `###MySQL tables, with their properties: 
      # Agents(AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY) 
      # Customer(CUST_CODE, CUST_NAME, CUST_CITY, WORKING_AREA, CUST_COUNTRY, GRADE, OPENING_AMT, RECEIVE_AMT, PAYMENT_AMT, OUTSTANDING_AMT, PHONE_NO, AGENT_CODE) 
      # orders (ORD_NUM, ORD_AMOUNT, ADVANCE_AMOUNT, ORD_DATE, CUST_CODE, AGENT_CODE, ORD_DESCRIPTION) 
      ### ${prompt}`},
    ],
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "json_object" },
  });

  const sql = JSON.parse(completion.choices[0].message.content).sql;
  console.log(sql)
  if (sql == null) {
    res.statusCode(502)
    res.send({error: "Failed to generate SQL query"})
  }

  dbConnection.query(sql, (error, result, fields) => {
    if (error) {
      // res.statusCode(502)
      console.log(error)
      // res.send({error:`Failed to query result:${error.message}`})
      // res.send({error:`Failed to query result:${error.message}`})
    } else {
      console.log(result)
      console.log(fields)
    }
  })
})

// routes all 404 back to react
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build/index.html"));
});

module.exports = app;
