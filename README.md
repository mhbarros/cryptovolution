<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



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
- Clone `.env.yaml.example` and rename it to `.env.yaml`. In both files, fill the environment variables.<br/>
   
| Variable           | Description                                                                                                         | Required |
|--------------------|---------------------------------------------------------------------------------------------------------------------|----------|
| DB_REGION          | The AWS region of DynamoDB. If localhost, set this to "localhost"                                                   | yes      |
| DB_ENDPOINT        | The URL to connect to DynamoDB. If localhost and using docker provided by Cryptovolution, use http://localhost:8000 | yes      |
| COINLAYER_API_KEY  | The API KEY given by CoinLayer services.                                                                            | yes      |
| COINLAYER_CURRENCY | The currency to retrieve the crypto values. Ex: USD                                                                 | yes      |

4. Install NPM packages
    ```sh
    npm ci
    ```


<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#top">back to top</a>)</p>




<!-- CONTACT -->
## Contact

Marcelo Barros - mhbarros99@gmail.com


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
