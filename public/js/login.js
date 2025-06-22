const login = async (email, password) => {
  try {
    const response = await axios({
      url: "http://localhost:5000/api/v1/users/login",
      method: "POST",
      data: { email, password },
    });
    console.log(response);
  } catch (err) {
    console.log(err);
  }
};

document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  login(email, password);
});
