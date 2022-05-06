import dotenv from 'dotenv'
dotenv.config()

import App from './src/app'

App.listen(process.env.PORT || 3000)
