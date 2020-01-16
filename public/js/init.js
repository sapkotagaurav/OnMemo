var btn = document.getElementById('login')
var google_btn = document.getElementById('google-signin')
btn.addEventListener("click", login)
google_btn.addEventListener('click', lol)
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        location.href = 'index.html'
    }
});

function lol() {
    var gProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(gProvider)
        .then(function (result) {
            
            location.href = 'index.html'
        })
        .catch(function (error) {
            alert(`${error.message}`)
        });
}
function login() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (response) {
            location.href = 'index.html'

        })
        .catch(function (error) {
            alert(error)
        });
}
