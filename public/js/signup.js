var signup = document.getElementById('signup')
signup.addEventListener('click', sign_up)
function sign_up() {
    var email = document.getElementById('email').value
    var pass = document.getElementById('password').value
    var name = document.getElementById('name').value
    var user
    firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then(function (response) {
            user = firebase.auth().currentUser
            user.updateProfile({ displayName: name }).then(function () {
                user.sendEmailVerification()
                    .then(function () {
                        document.getElementById('signup-div').style.display = 'none'
                        document.getElementById('go-verify').innerHTML = `Go to <i>${user.email}</i> to verify your email.`
                        document.getElementById('verify').style.display = 'initial'
                    }).catch(function (error) {
                        alert(error)
                       
                        
                    });

            }).catch(function (_e) {
                alert(_e)
                
                
            })
        })
        .catch(function (error) {
            alert(error)
                
            
            
        });


}
window.onload=function(){
    if (firebase.auth().currentUser) {
        location.href = 'signin.html'
    }
}

