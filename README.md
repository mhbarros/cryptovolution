<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="img/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Cryptovolution</h3>

  <p align="center">
    Create a list of cryptos and check their evolution over time
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a>
    <br />
    <br />
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

Cryptovolution is a Restful API capable of keep track of a list of cryptos.



### Built With
This amazing project was built with:

- [x] [Serverless Framework + AWS Stack](https://www.serverless.com/)
- [x] [Typescript](https://www.typescriptlang.org/)
- [x] [ExpressJS](https://expressjs.com/pt-br/)
- [x] [Express Validator](https://express-validator.github.io/docs/)
- [x] [Jest](https://jestjs.io/pt-BR/)
- [x] [Supertest](https://github.com/visionmedia/supertest)
- [x] [Prettier](https://prettier.io/)


<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites
You need to have these programs installed:
* [NodeJS](https://nodejs.org/en/)
* [Docker Desktop](https://www.docker.com/) (_or some other whay to run DynamoDB locally_)
* [Docker compose](https://docs.docker.com/compose/install/)
<br/><br/>
#### Also, you are going to need an [API KEY from CoinLayer](https://coinlayer.com/documentation), which is the service that Cryptovolution uses to get currentcryptocurrencies prices.

### Installation


_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._
1. Clone the repo
```sh
git clone git@github.com:mhbarros/cryptovolution.git
```

2. Get a free API KEY from [CoinLayer](https://coinlayer.com/documentation)

3. Define the environment variables<br/>
   - Clone the file `.env.example` and rename-it to `.env`
   - Clone `.env.yaml.example` and rename it to `.env.yaml`.
   - In both files, fill the following environment variables:<br/>
   
| Variable           | Description                                                                                                         | Required |
|--------------------|---------------------------------------------------------------------------------------------------------------------|----------|
| DB_REGION          | The AWS region of DynamoDB. If localhost, set this to "localhost"                                                   | yes      |
| DB_ENDPOINT        | The URL to connect to DynamoDB. If localhost and using docker provided by Cryptovolution, use http://localhost:8000 | yes      |
| COINLAYER_API_KEY  | The API KEY given by CoinLayer services.                                                                            | yes      |
| COINLAYER_CURRENCY | The currency to retrieve the crypto values. Ex: USD                                                                 | yes      |
| PORT               | The HTTP port to run the project locally. Default: 3000                                                             | no       |


4. Install NPM packages
    ```sh
    npm ci
    ```
   
5. Run docker-compose to create DynamoDB
    ```sh
   cd docker
   docker-compose up -d
    ```
   
6. Migrate database tables
    ```sh
   npm run migration
    ```


<!-- USAGE -->
## Usage
To start using Cryptovolution, start the project locally by running:
```sh
npm run dev
```

With the project running, now you have access to every endpoint that Cryptovolution has.

### Postman
You can see the list of endpoints and their descriptions using [this postman](https://www.getpostman.com/collections/d14eb4627c26d935548a). Also, the exported json from postman is available at [_postman](https://github.com/mhbarros/cryptovolution/tree/main/_postman) folder

### Updating crypto tokens history locally
When you have some crypto tokens registered using the `POST /tokens` endpoint, you may want to get some information to append into the history of values. To do that, you need to invoke the `updateCryptoValues` function locally, by running:

```sh
npm run update:cryptos
```

## Testing
To run the project unit tests:
```sh
npm run tests
```
<br/>
To run the project unit tests and generate a coverage report:

```sh
npm run tests:coverage
```

## Deploy

### Requirements
To deploy a instance of Cryptovolution into production environment, you need to have:
- A Serverless Framework account ([create it here](https://app.serverless.com/))
    - After creating the account, go to you `serverless.xml` file and **change the 'org' name to your username**
- An [AWS](https://aws.amazon.com/pt/) Account
- A user within IAM that is capable of creating the services that Serverless Framework requires. You can check how to setup a user [here](https://www.serverless.com/framework/docs/providers/aws/guide/credentials)

<br/>

### Setting up a scheduled time to update crypto values
To setup a custom time to auto update all registered crypto tokens in production, you can update the environment variable `CRYPTO_UPDATE_INTERVAL` into **serverless.xml**, using the pattern described into this documentation: https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html#eb-rate-expressions

### Time to deploy
<br/>
After setup everything correctly, you can deploy the project to your aws account by running:

```sh
npm run deploy
```



<!-- CONTACT -->
## Contact

Marcelo Barros - mhbarros99@gmail.com


<!-- MARKDOWN LINKS & IMAGES -->
[linkedin-url]: https://linkedin.com/in/mhbarros
