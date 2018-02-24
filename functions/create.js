'use strict';

const uuidv4 = require('uuid/v4');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const defaultResponse = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// This function should be called with 2 params
// contentUrl and styleUrl
module.exports.createRecord = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  console.log(data);

  // TODO: Validate images exist in S3
  if (!data.contentUrl || !data.styleUrl) {
    console.error('Validation failed');

    const response = Object.assign({}, defaultResponse, {
      statusCode: '400',
      body: JSON.stringify({ error: 'Invalid arguments' }),
    });

    callback(null, response);
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuidv4(),
      status: 'PROCESSING',
      contentUrl: data.contentUrl,
      styleUrl: data.styleUrl,
      createdAt: timestamp,
      updatedAt: timestamp
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.error(error);
      const response = Object.assign({}, defaultResponse, {
        statusCode: error.statusCode || 500,
        body: JSON.stringify({ error: error.message || 'Couldnt create the record in Dynamodb' })
      });
      callback(null, response);
      return;
    }

    const response = Object.assign({}, defaultResponse, {
      statusCode: 200,
      body: JSON.stringify(params.Item)
    });

    callback(null, response);
  });
};