module.exports = {
  "globDirectory": "public/",
  "globPatterns": [
    "**/*.{html,ico,json,css,png,jpg,js}",  //use minified files
    "src/images/*.{jpg,png}"
  ],
  "swSrc": "public/sw-base.js",
  "swDest": "public\\service-worker.js",
  "globIgnores": [
    "help/**",
    "404.html"
  ]
};