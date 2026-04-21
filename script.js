
// ===== LOAD DANH SÁCH MÃ =====
let validCodes = JSON.parse(localStorage.getItem("validCodes")) 
    || ["NT003"];

// ===== LOAD USER =====
let user = JSON.parse(localStorage.getItem("user")) || null;

// ===== CHUYỂN TRANG =====
function showLogin() {
    document.getElementById("registerPage").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
}

function showRegister() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("registerPage").style.display = "block";
}

// ===== ĐĂNG KÝ =====
function register() {
    let code = document.getElementById("inviteCode").value.trim();
    let name = document.getElementById("regName").value.trim();
    let phone = document.getElementById("regPhone").value.trim();
    let birth = document.getElementById("regBirth").value;

    if (!code || !name || !phone || !birth) {
        alert("Nhập đầy đủ thông tin!");
        return;
    }

    // kiểm tra mã
    if (!validCodes.includes(code)) {
        alert("Mã không hợp lệ!");
        return;
    }

    // tạo mã nhân viên
    let id = "NV" + Math.floor(Math.random() * 1000);

    user = { name, phone, birth, id };

    // lưu user
    localStorage.setItem("user", JSON.stringify(user));

    // XÓA mã đã dùng
    validCodes = validCodes.filter(c => c !== code);
    localStorage.setItem("validCodes", JSON.stringify(validCodes));

    alert("Đăng ký thành công!\nMã nhân viên: " + id);

    showLogin();
}

// ===== ĐĂNG NHẬP =====
function login() {
    let name = document.getElementById("loginName").value.trim();
    let id = document.getElementById("loginId").value.trim();

    let savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
        alert("Chưa có tài khoản!");
        return;
    }

    if (name === savedUser.name && id === savedUser.id) {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("mainApp").style.display = "block";

        document.getElementById("staff").innerText =
            "Nhân viên: " + name + " | Mã: " + id;

        startCamera();
    } else {
        alert("Sai thông tin!");
    }
}

// ===== CAMERA =====
function startCamera() {
    const codeReader = new ZXing.BrowserBarcodeReader();
    const video = document.getElementById("video");

    codeReader.getVideoInputDevices().then(devices => {
        if (devices.length === 0) {
            alert("Không tìm thấy camera");
            return;
        }

        codeReader.decodeFromVideoDevice(devices[0].deviceId, video, (result) => {
            if (result) {
                document.getElementById("barcode").value = result.text;
                scanProduct();
            }
        });
    });
}

// ===== SẢN PHẨM =====
let products = {
    "111": { name: "Coca Cola", price: 10000 },
    "222": { name: "Bánh mì", price: 5000 },
    "333": { name: "Sữa", price: 15000 }
};

let cart = [];

// ===== QUÉT =====
function scanProduct() {
    let code = document.getElementById("barcode").value.trim();

    if (!products[code]) {
        alert("Không tìm thấy sản phẩm!");
        return;
    }

    let found = cart.find(item => item.code === code);

    if (found) {
        found.qty++;
    } else {
        cart.push({
            code: code,
            name: products[code].name,
            price: products[code].price,
            qty: 1
        });
    }

    render();
    document.getElementById("barcode").value = "";
}

// ===== HIỂN THỊ HÓA ĐƠN =====
function render() {
    let tbody = document.querySelector("#bill tbody");
    tbody.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        let row = `
            <tr>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.qty}</td>
                <td>${item.price * item.qty}</td>
            </tr>
        `;
        tbody.innerHTML += row;
        total += item.price * item.qty;
    });

    document.getElementById("total").innerText =
        "Tổng tiền: " + total + " VNĐ";
}

// ===== THANH TOÁN =====
function pay() {
    if (cart.length === 0) {
        alert("Chưa có sản phẩm!");
        return;
    }

    alert("Thanh toán thành công!");

    cart = [];
    render();
}

// ===== THỜI GIAN =====
setInterval(() => {
    let now = new Date();
    let timeEl = document.getElementById("time");
    if (timeEl) {
        timeEl.innerText = now.toLocaleString();
    }
}, 1000);