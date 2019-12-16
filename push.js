var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BAvXd4zawfZTryN5VgwdQsOxunnLHWsLDNyaRcXI45viCpXganv7iDZLJaXQ6iKHetqy_kw6E4RY6TcGVoVPX58",
    "privateKey": "6ReOytgH7r3lEb10YTNIcQmYShy1m8qgVQ9VMa6uPmc"
};

webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/cgc2edD1gyk:APA91bETB74p-n2JWma2m9TU0TEYZvHs5PUN6AjndtcGoirCDRulXk1YCxi9kY_I9ACZ30ooU3mUrlyGfdFwcX3_Sgmv01Yr7jUDp9JerUCY7c-pSlzS2Iw3VqR75hB7UbczB7n5fv50",
    "keys": {
        "p256dh": "BKd2mIS51zlFIyI3kdRKjUjBsFEQ3+UQ7imMXwtWAFhBuVzTHDvsDC8asS76rz4fca4yhEHrx/5hQdAYyt2MuG0=",
        "auth": "coLrVJc+ttGVvhOSWPYsCQ=="
    }
};
var payload = 'Chelsea Menang';
var options = {
    gcmAPIKey: '435161968191',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);