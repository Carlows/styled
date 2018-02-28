'use strict';

const AWS = require('aws-sdk');

var dynamoDB = new AWS.DynamoDB.DocumentClient();

const defaultResponse = {
  headers: {
    'Content-Type': 'application/json',
  },
};

module.exports.fetchRecords = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE
  };

  dynamoDB.scan(params, function (err, data) {
    if (err) {
      callback(err);
      return;
    }

    const response = Object.assign({}, defaultResponse, {
      statusCode: '200',
      body: JSON.stringify({ items: data.Items })
    });

    callback(null, response);
  });
};
