const fs = require("fs");
const path = require("path");

// Đường dẫn đến file .jsxbin cần giải mã
const filePath = path.join(__dirname, "./demo.jsxbin");
// Đường dẫn đến file đầu ra sau khi giải mã
const outputFilePath = path.join(__dirname, "./output.js");

// Kiểm tra sự tồn tại của file đầu vào
if (!fs.existsSync(filePath)) {
  console.error("❌ Không tìm thấy file demo.jsxbin. Vui lòng kiểm tra lại đường dẫn.");
  process.exit(1);
}

try {
  // Đọc nội dung file demo.jsxbin
  const content = fs.readFileSync(filePath, "utf-8");

  // Kiểm tra định dạng nội dung
  const match = content.match(/^@JSXBIN@.+?@(.+)$/s);
  if (!match) throw new Error("Không tìm thấy nội dung mã hóa trong file demo.jsxbin.");

  const encoded = match[1];
  console.log("Nội dung đã mã hóa:", encoded); // Kiểm tra nội dung mã hóa

  let decoded;

  // Kiểm tra xem nội dung có phải Base64 hay không
  if (/^[A-Za-z0-9+/=]+$/.test(encoded)) {
    // Nếu là Base64, giải mã
    decoded = Buffer.from(encoded, "base64").toString("utf-8");
    console.log("✅ Nội dung đã được giải mã từ Base64.");
  } else {
    // Nếu không phải Base64, xử lý theo định dạng JSXBIN
    decoded = decodeJSXBIN(encoded);
    console.log("✅ Nội dung đã được giải mã từ định dạng JSXBIN.");
  }

  // Ghi nội dung đã giải mã vào file đầu ra
  fs.writeFileSync(outputFilePath, decoded);
  console.log(`✅ Giải mã xong. Mã nguồn đã được lưu tại: ${outputFilePath}`);
} catch (err) {
  console.error("❌ Lỗi:", err.message);
}

// Hàm giải mã định dạng JSXBIN
function decodeJSXBIN(encoded) {
  let decoded = "";
  for (let i = 0; i < encoded.length; i++) {
    const charCode = encoded.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) {
      // Giảm mã ASCII với điều kiện
      decoded += String.fromCharCode(charCode - 1);
    } else {
      decoded += encoded[i];
    }
  }
  return "// Đây là nội dung đã được giải mã từ JSXBIN\n" + decoded;
}

// Hàm mã hóa lại tệp JSXBIN
function encodeJSXBIN() {
  'function' == typeof $.global.run || ($.global.run = function (fd, ff, bin, msg, JBL, o, i, t, n) {
    // Thư mục đầu vào mặc định
    fd = callee.FD || File($.fileName).parent;
    fd && fd instanceof Folder && fd.exists || (fd = Folder.desktop);

    // Chọn tệp đầu vào
    ff = fd.openDlg("Chọn tệp JSXBIN để mã hóa.");
    if (!ff || !(ff instanceof File)) return;
    (ff.open('r') && (ff.encoding = 'UTF8')) || $$.error(`Không thể mở ${ff} để đọc.`);

    // Đọc nội dung tệp
    bin = ff.read();
    ff.close();
    callee.FD = ff.parent;

    // Xác định có mã hóa tên hàm không
    msg = "JsxBlind sẽ mã hóa các biến, hằng số và tham số.\r\r" +
      "Bạn có muốn mã hóa TÊN HÀM không?\r\r" +
      "[Khuyến nghị nếu mã của bạn không kiểm tra tên hàm theo cách thủ công.]";
    callee.FN = confirm(msg, !!callee.FN, "JsxBlind");

    // Chạy trình mã hóa
    JBL = $$.JsxBlindLib;
    bin = JBL(bin, { progress: 1, report: 1, noWrapper: 0, hitFuncNames: callee.FN });
    if (!bin) $$.error("JsxBlind không trả về kết quả. Hãy đảm bảo tệp đầu vào của bạn hợp lệ.");

    // Tạo báo cáo
    o = JBL.getReport();
    n = o.count;
    if (!n) $$.error("JsxBlind không thể thay đổi bất kỳ định danh nào.");
    msg = `${n} định danh đã được xử lý.\r`;
    for (i = -1; ++i < 2;) {
      t = o[i ? 'swaps' : 'changes'];
      if (!t || !(n = t.length)) continue;
      t.sort();
      if (n > 20) t.splice(10, n - 20, '"..."');
      t = t.join(' ').match(/\"[^\"]+\"/g);
      if (t) {
        msg += `\r${i ? 'Đã đổi id' : 'Đã viết lại id'} (${n}) : ${t.join(', ').replace(/\"/g, '')}.`;
      }
    }
    msg += "\r\rLưu kết quả?";
    if (!confirm(msg, false, "JsxBlind")) return;

    // Lưu tệp kết quả
    ff = ff.saveDlg("Lưu tệp jsxbin");
    if (!ff) return;
    (ff.open('w') && (ff.encoding = 'UTF8')) || $$.error(`Không thể mở ${ff} để ghi.`);
    ff.write(bin);
    ff.close();

    // Hiển thị thư mục chứa tệp
    ff.parent.execute();
  });

  try { run(); } catch (e) { alert(e); }
  $$.unload();
}