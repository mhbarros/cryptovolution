import AWS from 'aws-sdk'

const database = new AWS.DynamoDB.DocumentClient({
  region: process.env.DB_REGION,
  endpoint: process.env.DB_ENDPOINT,
})

export default database
