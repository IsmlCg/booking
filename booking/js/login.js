
var inputElementName = document.getElementById("username");
var username = inputElementName.value;
var inputElementPassword = document.getElementById("password");
var userPassword = inputElementPassword.value;
// Set a cookie
setCookie( "username", username, 1);

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
  }
  
  function getCookie(name) {
    var cookieName = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.indexOf(cookieName) === 0) {
        return decodeURIComponent(cookie.substring(cookieName.length));
      }
    }
    return null;
  }
  function setUsername(){
    var inputElementName = document.getElementById("username");
    var username = inputElementName.value;
    // Set a cookie
    setCookie( "username", username, 1);
  }
  function login() {
    const data = {
        username: inputElementName.value,
        password: inputElementPassword.value
    };

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        if (response.token) {
            setCookie( "token", response.token, 1);
            window.location.href = "main";
            // Save the token in local storage or a cookie if needed
        } else {
            alert("Login failed. Please check your credentials.");
        }
    })
    .catch(error => console.error("Error:", error));
}