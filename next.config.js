/** @type {import('next').NextConfig} */
import path from "path";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
    // output: 'export',

    webpack: (config) => {
        config.resolve.alias['@huggingface/transformers'] = path.resolve(__dirname, 'node_modules/@huggingface/transformers');
        config.resolve.alias = {
            ...config.resolve.alias,
            "sharp$": false,
            "onnxruntime-node$": false,
        }
        return config;
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
          },
        ],
      },
      transpilePackages: ['react-filerobot-image-editor'],


};

export default nextConfig;