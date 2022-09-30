const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('Api is running')
})

app.listen(process.env.PORT || 8000, () => console.log("Server is running"))