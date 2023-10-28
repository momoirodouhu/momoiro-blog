import { createClient } from 'microcms-js-sdk'

export default createClient({
    serviceDomain: "momoiro-blog",
    apiKey:process.env.API_KEY
  })