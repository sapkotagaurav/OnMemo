var user;
var arrayy = [];
var logout = document.getElementById("logout");
var resend = document.getElementById("resend");
var userinfo = document.getElementById("user-info");
var verified = document.getElementById("verified");
var verified_txt = document.getElementById("verified-txt");
var addpost = document.getElementById("add-post");
var title = document.getElementById("title-post");
var post = document.getElementById("post-main");
var addpostbtn = document.getElementById("add-post-btn");
var closemod = document.getElementById("close-modal");
var closemodview = document.getElementById("close-modal-view");
var view_modal = document.getElementById("modal-view");
var view_title = document.getElementById("view-title");
var view_date = document.getElementById("view-date");
var view_art = document.getElementById("view-article");
var main_memo = document.getElementById("main-memo");
addpost.addEventListener("click", postadd);
addpostbtn.addEventListener("click", addpostdb);
resend.addEventListener("click", resend_verify);
logout.addEventListener("click", logou);
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    if (user.emailVerified) {
      eveokay();
    } else {
      userinfo.style.display = "none";
      verified_txt.textContent = `Dear ${
        user.displayName.split(" ")[0]
      } ,Go and verify your email ${user.email}`;
      verified.style.display = "initial";
    }
  } else {
    location.href = "signin.html";
  }
});
function resend_verify() {
  user = firebase.auth().currentUser;
  firebase
    .auth()
    .currentUser.sendEmailVerification()
    .then(function () {
      document.getElementById(
        "verified-txt"
      ).innerHTML = `Email sent to ${user.email}`;
    })
    .catch(function (error) {
      // An error happened.
    });
}
function logou() {
  firebase
    .auth()
    .signOut()
    .then(function () {})
    .catch(function (error) {
      alert(error);
    });
}

function eveokay() {
  userinfo.style.display = "initial";
  user = firebase.auth().currentUser;
  document.getElementById("username").innerText = user.displayName;
  if (user.photoURL) {
    document.getElementById(
      "container-nav"
    ).innerHTML = `<img src='${user.photoURL}' id='user-icon'></img> `;
  } else {
    document.getElementById("namee").innerHTML =
      user.displayName.charAt(0) + user.displayName.split(" ")[1].charAt(0);
  }
  arrayy =[];
  firebase
    .database()
    .ref(`posts/${user.uid}`)
    .once("value", function (snap) {
      snap.forEach(function (cS) {
        valuetoPush = {
          title: cS.val()["title"],
          post: cS.val()["post"],
          date: cS.val()["date"],
        };
        arrayy.unshift(valuetoPush);
      });
      while(main_memo.firstChild) main_memo.removeChild(main_memo.firstChild);
      update_data(arrayy)
    });
}
function update_data(arrayy){
    arrayy.forEach(function (element, index) {
        console.log(arrayy[index], index);
        var col = document.createElement("div");
        col.className = "col-3 mb-3";
        var srt = document.createElement("div");
        srt.className = "card w-70";
        srt.style.height = "15rem";
        //srt.onclick=view(element['title'],element['date'],element['post'])
        srt.style.cursor = "pointer";
        var titleP = document.createElement("div");
        titleP.className = "card-title";
        var articleP = document.createElement("div");
        articleP.className = "card-text";
        var tith = document.createElement("h3");
        tith.textContent = element[`title`];
        var arth = document.createElement("h6");
        arth.innerHTML = element[`post`];
        var dateh = document.createElement("small");
        dateh.className = "text-muted";
        var date = new Date(element["date"]);
        dateh.textContent = date;
        dateh.style.float = "right";
        titleP.appendChild(tith);
        titleP.appendChild(dateh);
        articleP.appendChild(arth);
        srt.setAttribute(
          "onclick",
          `view("${arrayy[index].title}","${date}","${arrayy[index].post}")`
        );
        srt.appendChild(titleP);
        srt.appendChild(articleP);
        col.appendChild(srt);
        main_memo.appendChild(col);
      });
}

function postadd() {
  document.getElementById("modal-name").style.display = "block";
}
function addpostdb() {
  if (title.value.split("").length < 1 && post.value.split(" ").length < 2) {
    alert(
      "Title must contain at least letter. Memo must contain at least two words"
    );
  } else if (title.value.split("").length < 1) {
    alert("Title must contain at least letter");
  } else if (post.value.split(" ").length < 2) {
    alert("Memo must contain at least two words");
  } else {
    var p = post.value
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll(`"`, "&quot;")
      .replaceAll("\n", "<br>");

    document.getElementById("modal-name").style.display = "none";
    const p1 = new Promise((resolve,reject)=>{
      resolve(document.getElementById('main-memo').innerHTML="")

    })
    p1.then(()=>{
      console.log("Here");
      writeUserData(user.uid, title.value, p, Date.now());

    })

  }
}

closemod.onclick = function () {
  document.getElementById("modal-name").style.display = "none";
};
closemodview.onclick = function () {
  document.getElementById("modal-view").style.display = "none";
};

window.onclick = function (e) {
  if (e.target == document.getElementById("modal-sandbox")) {
    document.getElementById("modal-name").style.display = "none";
  }
  if (e.target == document.getElementById("modal-sandbox-view")) {
    document.getElementById("modal-view").style.display = "none";
  }
};

function writeUserData(userId, title, post, date) {
  var newPostKey = firebase.database().ref().child("posts").push().key;
  firebase
    .database()
    .ref(`posts/${userId}/${newPostKey}`)
    .set(
      {
        title: title,
        post: post,
        date: date,
      },
      (error) => {
        if (!error) {
            main_memo.innerHTML=""
          eveokay();
        } else {
          console.error("Error adding post");
        }
      }
    );
  var allPb = firebase.database().ref(`posts/${user.uid}`).orderByChild("date");
}
function view(title, date, post) {
  view_title.style.whiteSpace = "pre-wrap";
  view_title.textContent = title;
  view_date.textContent = date;
  view_art.innerHTML = post;
  document.getElementById("modal-view").style.display = "block";
}
