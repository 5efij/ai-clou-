let model;

mobilenet.load().then(m => model = m);

// 🟢 نخلي الكود يشتغل بس إذا العنصر موجود
const upload = document.getElementById("upload");

if (upload) {

  const image = document.getElementById("image");
  const result = document.getElementById("result");

  upload.addEventListener("change", async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    image.src = URL.createObjectURL(file);
    result.innerText = "Analyzing...";

    const predictions = await model.classify(image);
    let top = predictions[0];

    let decision = "Normal ✅";

    if (top.className.includes("knife") || top.className.includes("gun")) {
      decision = "🚨 Dangerous";
    } else if (top.probability < 0.6) {
      decision = "❓ Uncertain";
    }

    result.innerText =
      "Object: " + top.className +
      "\nAccuracy: " + (top.probability * 100).toFixed(2) + "%" +
      "\nDecision: " + decision;

    let record = `
      <div>
        <p>${top.className} - ${decision}</p>
        <img src="${image.src}" width="100">
      </div>
    `;

    let old = localStorage.getItem("history") || "";
    localStorage.setItem("history", old + record);
  });
}
