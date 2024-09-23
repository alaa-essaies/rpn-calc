module.exports = {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript', // Ensure TypeScript is included
    ],
    plugins: ['explicit-exports-references']
  };
  