import dotenv from 'dotenv'

dotenv.config()

export const config = {url: import.meta.env.VITE_BACKEND_URL}
