import e from "express";
import sharp from "sharp";

const app = e();
const port = 3000;

app.use(e.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("It works!");
});

app.post("/resize", async (req, res) => {
  try {
    const { base64Image, width, height } = req.body;

    if (!base64Image || !width || !height) {
      return res
        .status(400)
        .json({ error: "Missing required fields: base64Image, width, height" });
    }

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    const resizedBuffer = await sharp(imageBuffer)
      .resize(parseInt(width), parseInt(height), {
        fit: "inside",
      })
      .toBuffer();

    const resizedBase64Image = `data:image/jpeg;base64,${resizedBuffer.toString(
      "base64"
    )}`;

    res.json({ resizedImage: resizedBase64Image });
  } catch (error) {
    console.error("Error resizing image:", error);
    res.status(500).json({ error: "Failed to resize image" });
  }
});

app.listen(port, () => {
  console.log(`The server is running at port ${port}`);
});
