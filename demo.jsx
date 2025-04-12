const fs = require("fs");

// Hàm decode từ mã JSXBIN sang ký tự thường
function decodeJSXBinSegment(input) {
  const lowerCaseMap = {};
  const upperCaseMap = {};
  const digitMap = {};

  for (let i = 0; i < 26; i++) {
    const lowerChar = String.fromCharCode(97 + i); // a-z
    const upperChar = String.fromCharCode(65 + i); // A-Z

    lowerCaseMap[i === 25 ? "ja" : `j${String.fromCharCode(66 + i)}`] = lowerChar;
    upperCaseMap[i === 25 ? "ia" : `i${String.fromCharCode(66 + i)}`] = upperChar;
  }

  for (let i = 0; i <= 9; i++) {
    digitMap[`d${String.fromCharCode(65 + i)}`] = i.toString();
  }

  const fullMap = { ...lowerCaseMap, ...upperCaseMap, ...digitMap };

  let result = "";
  for (let i = 0; i < input.length;) {
    const chunk = input.substring(i, i + 2);

    if (fullMap[chunk]) {
      result += fullMap[chunk];
      i += 2;
    } else if (input.substring(i, i + 2) === "ja") {
      result += "z";
      i += 2;
    } else if (input.substring(i, i + 2) === "ia") {
      result += "Z";
      i += 2;
    } else {
      result += input[i];
      i += 1;
    }
  }

  return result;
}

// Đọc file demo.jsxbin
const inputPath = "demo.jsxbin";
const outputPath = "output.js";

fs.readFile(inputPath, "utf8", (err, data) => {
  if (err) {
    console.error("Lỗi đọc file:", err);
    return;
  }

  // Bỏ phần đầu @JSXBIN@... nếu cần
  const cleanInput = data.replace(/@JSXBIN@[\s\S]*?@/, "").trim();

  // Giải mã
  const decoded = decodeJSXBinSegment(cleanInput);

  // Ghi vào file mới
  fs.writeFile(outputPath, decoded, (err) => {
    if (err) {
      console.error("Lỗi ghi file:", err);
    } else {
      console.log("✅ Giải mã thành công! Đã lưu vào:", outputPath);
    }
  });
});
