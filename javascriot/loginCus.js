async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(
        "https://freshx-api.azurewebsites.net/api/AccountCus/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        }
    );

    if (response.ok) {
        const data = await response.json();
        alert("Đăng nhập thành công");
        // Lưu token và customerId vào localStorage hoặc sessionStorage nếu cần
        localStorage.setItem("token", data.token);
        localStorage.setItem("customerId", data.customerId);
        // Chuyển hướng tới trang khác sau khi đăng nhập thành công
        window.location.href = "./index-logined.html";
    } else {
        alert("Đăng nhập thất bại");
    }
}
