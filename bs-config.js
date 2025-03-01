module.exports = {
    proxy: "http://localhost:5173", // your Express app
    files: ["src/styles/*.scss", "views/**/*.tsx"], // files to watch
    port: 4000, // port for BrowserSync
    open: true,
    notify: false
  };