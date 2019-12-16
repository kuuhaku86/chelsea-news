document.addEventListener("DOMContentLoaded",function() {
    var elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
    loadNav();

    function loadNav() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState == 4){
                if (this.status != 200) return;
                
                document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
                    elm.innerHTML = xhttp.responseText;
                });

                document.querySelectorAll(".topnav, .sidenav, .brand-logo").forEach(function(elm) {
                    elm.addEventListener("click",function(e) {
                        var sidenav = document.querySelector(".sidenav");
                        M.Sidenav.getInstance(sidenav).close();

                        page = e.target.getAttribute("href").substr(1);
                        loadPage(page);
                    });
                });
            }
        };
        xhttp.open("GET", "nav.html", true);
        xhttp.send();
    }

    var page = window.location.hash.substr(1);
    if(page == "") page = "matches";
    console.log(page);
    loadPage(page);

    function loadPage(page) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState == 4){
                if(page == "matches") getMatches();
                else if(page == "standings") getStandings();
                else if(page == "favorites") getFavorites();
                var content = document.getElementById("body-content");
                if(this.status == 200) content.innerHTML = xhttp.responseText;
                else if(this.status == 404) content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
                else content.innerHTML = "<p>Ups... halaman tidak dapat diakses.";
            }
        }
        xhttp.open("GET", "pages/" + page + ".html",true);
        xhttp.send();
    }

});
function requestPermission() {
    if('Notification' in window) {
        Notification.requestPermission()
            .then(function(result) {
                if(result == "denied") {
                    console.log("Fitur notifikasi tidak diijinkan");
                    return;
                } else if(result == "default") {
                    console.log("Pengguna menutup kotak dialog permintaan perizinan");
                    return;
                }

                if(('PushManager' in window)) {
                    navigator.serviceWorker.getRegistration()
                    .then(function(registration){
                        registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUnit8Array("BAIC4lZ59wiSvoiF79uuiB-Kf3HtMC8NeFFaHRnGsZx6RmBWHtI4gX6WVcYQ7vo7e0v4qfA3KIwmByF0RwUiZ1s")
                        }).then(function(subscribe) {
                            console.log('Berhasil melakukan subscribe dengan endpoint', subscribe.endpoint);
                            console.log("Berhasil melakukan subscribe dengan p256dh key: ", btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('p256dh')))));
                            console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('auth')))));
                        }).catch(function(e) {
                            console.log('Tidak dapat melakukan subscribe ', e.message);
                        });
                    });
                }
            });
    }
}

function urlBase64ToUnit8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g,'/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}