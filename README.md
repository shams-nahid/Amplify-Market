# B2b Market Place

[Live](http://b2b-market-place.shams-nahid.com/)

- Use to buy and sell products.
- Secure payment
- Multi factor authentication and verification

## Features

- Serverless `GraphQl` api with `aws-app-sync`
- Multi factor authentication with verification using `aws-cognito`
- Serverless rest API with `aws-lamda`
- `GraphQL Subscriptions` to Broadcast data change in real time
- `GraphQL` queries and mutations from react-application
- Email sending with `aws-ses`
- `S3` for image upload
- Host site using `s3-static-site` hosting
- `dynamoDB` for storing and managing data
- Search functionality using `aws-elastic-search`
- `stripe` for payment
- Email verification with `aws-ses`
- State management with `context` API
- Routing with `react-router-dom`
- Date formatting with `date-fns` library
- `element-react` CSS library

## Prerequisites

- Node 12.16.2
- npm 6.14.4

## Getting Started

Clone the repository

```bash
git clone https://github.com/bmshamsnahid/Amplify-Market.git
```

Go to root directory

```bash
cd Amplify-Market
```

Install dependencies

```bash
npm i
```

Finally pull the amplify configuration.

Now, run the project

```bash
npm start
```

Your app will be available in `http://localhost:3000/`

## Deployment

To build app

```bash
npm run build
```

Put the `build` directory to `S3` static site.

## Built With

- AWS Amplify
- React.js
- Node.js (AWS SAM)
- Express.js (AWS SAM)
- REST API (AWS Lamda)
- GraphQL API (AWS AppSync)
- AWS SES
- AWS S3
- AWS DynamoDB
- AWS Elastic Search
- Element React (UI librarry)

## License

This project is licensed under the MIT License.

## Acknowledgments

- [UDEMY Course](https://www.udemy.com/course/serverless-react-with-aws-amplify/)
