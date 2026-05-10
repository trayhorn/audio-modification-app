const express = require('express')
const audioRouter = require('./routes/audioRouter');
const cors = require('cors');

const app = express()
const port = 3000

app.use(express.json());
app.use(
	cors({
		origin: "*",
	})
);

app.use('/audio', audioRouter);

app.use((_, res) => {
	res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
	const { status = 500, message = "Server error" } = err;
	res.status(status).json({ message });
});


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})