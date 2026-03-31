// firebase-messaging-sw.js

importScripts(
	"https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
	"https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
	apiKey: "",
	authDomain: ".firebaseapp.com",
	databaseURL:
		".firebasedatabase.app",
	projectId: "",
	storageBucket: ".firebasestorage.app",
	messagingSenderId: "",
	appId: "",
	measurementId: "",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	console.log(
		"[firebase-messaging-sw.js] Received background message ",
		payload
	);

	messaging.onMessage((payload) => {
		console.log("Foreground message:", payload);
		document.getElementById("received-message").textContent =
			JSON.stringify(payload);
	});

	// Send message to clients
	self.clients.matchAll().then((clients) => {
		clients.forEach((client) => {
			client.postMessage({
				msg: "Received a background message",
				data: payload,
			});
		});
	});

	// Customize notification here
	const notificationTitle =
		payload.notification?.title || "Background Message Title";

	const notificationOptions = {
		body: payload.notification?.body || "Background Message body.",
	};

	self.registration.showNotification(notificationTitle, notificationOptions);
});
