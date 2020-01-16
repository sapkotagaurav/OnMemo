var user;
var logout = document.getElementById('logout')
var resend = document.getElementById('resend')
var userinfo = document.getElementById('user-info')
var verified = document.getElementById('verified')
var verified_txt = document.getElementById('verified-txt')
var addpost = document.getElementById('add-post')
var title = document.getElementById('title-post')
var post = document.getElementById('post-main')
var addpostbtn = document.getElementById('add-post-btn')
var closemod = document.getElementById('close-modal')
var main_memo=document.getElementById('main-memo')
addpost.addEventListener('click', postadd)
addpostbtn.addEventListener('click',addpostdb)
resend.addEventListener('click', resend_verify)
logout.addEventListener("click", logou)
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        if (user.emailVerified) {
            eveokay()
        } else {
            userinfo.style.display = 'none'
            verified_txt.textContent = `Dear ${user.displayName.split(' ')[0]} ,Go and verify your email ${user.email}`
            verified.style.display = 'initial'
        }
    } else {
        location.href = 'signin.html'
    }
});
function resend_verify() {
     user = firebase.auth().currentUser;
    firebase.auth().currentUser.sendEmailVerification()
        .then(function () {
            document.getElementById('verified-txt').innerHTML = `Email sent to ${user.email}`
        }).catch(function (error) {
            // An error happened.
        });
}
function logou() {
    firebase.auth().signOut()
        .then(function () {

        }).catch(function (error) {
            alert(error)
        });
}
function eveokay() {
    userinfo.style.display = 'initial'
     user = firebase.auth().currentUser;
    if (user.photoURL) {
        document.getElementById('container').innerHTML = `<img src='${user.photoURL}' id='user-icon'></img> `
    } else {
        document.getElementById('namee').innerHTML = user.displayName.charAt(0) + user.displayName.split(" ")[1].charAt(0)
    }
    firebase.database().ref(`posts/${user.uid}`).once('value',function (snap) {
        snap.forEach( function(cS) {
            console.log(cS.val()[`title`]);
            var srt = document.createElement('div')
            srt.className = 'article'
            var titleP = document.createElement('div')
            titleP.className ='title'
            var articleP = document.createElement('div')
            articleP.className='article'
            var tith = document.createElement('h3')
            tith.textContent=cS.val()[`title`]
            var arth = document.createElement('h6')
            arth.textContent = cS.val()[`post`]
            var dateh = document.createElement('h6')
            var date=new Date(cS.val()['date'])
            dateh.textContent = date
            dateh.style.float ='right'
            titleP.appendChild(tith)
            titleP.appendChild(dateh)
            articleP.appendChild(arth)
            srt.appendChild(titleP)
            srt.appendChild(articleP)
            main_memo.appendChild(srt)

        });            
                })

}

function postadd() {
    document.getElementById("modal-name").style.display = 'block'
}
function addpostdb() {
writeUserData(user.uid,title.value,post.value,Date.now())}
closemod.onclick = function () {
    document.getElementById("modal-name").style.display = 'none'

}

window.onclick = function (e) {
    if (e.target == document.getElementById("modal-sandbox")) {
        document.getElementById("modal-name").style.display = 'none'
  
        
    }
}

function writeUserData(userId, title, post, date) {

    var newPostKey = firebase.database().ref().child('posts').push().key;
    firebase.database().ref(`posts/${userId}/${newPostKey}`).set({
title:title,
post:post,
date:date


   })
   var allPb=firebase.database().ref(`posts/${user.uid}`).orderByChild( "date")

      
   
  }