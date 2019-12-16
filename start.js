async function registerServiceWorker() {
    return navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
            console.log('Registrasi service worker berhasil');
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
                                    applicationServerKey: urlBase64ToUnit8Array("BAvXd4zawfZTryN5VgwdQsOxunnLHWsLDNyaRcXI45viCpXganv7iDZLJaXQ6iKHetqy_kw6E4RY6TcGVoVPX58")
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
            return registration;
        })
        .catch(function(err) {
            console.log('Registrasi service worker gagal: ', err);
        });
    }
    
    var check = null;
if("serviceWorker" in navigator) {
    registerServiceWorker();
    // requestPermission();
} else {
    console.log("ServiceWorker belum didukung browser ini");
}