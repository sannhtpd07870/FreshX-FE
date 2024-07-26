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
        localStorage.setItem("token", data.token);
        window.location.href = "./index-logined.html";
    } else {
        const error = await response.json();
        alert(`Đăng nhập thất bại: ${error.message}`);
    }
}
