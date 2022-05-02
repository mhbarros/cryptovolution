import serverless from 'serverless-http'

import App from './src/app'

export const handler = serverless(App)
