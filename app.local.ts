/**
 * This file is used only to create a localhost development environemnt.
 * It uses the express application, but only runs locally.
 */

import dotenv from 'dotenv'
dotenv.config()

import App from './src/app'

App.listen(process.env.PORT || 3000)
