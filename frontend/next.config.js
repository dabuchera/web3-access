/** @type {import('next').NextConfig} */
const nextConfig = {
  //https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
  reactStrictMode: true,
  swcMinify: true,
  env: {
    REACT_APP_NETWORK_ENV: 'testnet',
    REACT_APP_CONTRACT_ADDRESS: 'ST3QAYFPQJX93Z2JANY2602C2NK8ZGG0MREAMM0DH',
    // REACT_APP_TOKEN_CONTRACT_NAME: '',
    // CONTRACT_PRIVATE_KEY: '',
    LOCAL_STACKS_API_PORT: 3999,
    // API_SERVER: undefined,
  },
}

module.exports = nextConfig
