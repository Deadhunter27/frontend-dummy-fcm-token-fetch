// Simple build script to inject .env values into index.html and firebase-messaging-sw.js

const fs = require("fs");
const path = require("path");

const root = __dirname;
const files = ["index.html", "firebase-messaging-sw.js"];

// Load .env manually (very small parser)
const envPath = path.join(root, ".env");
const envContent = fs.readFileSync(envPath, "utf8");
const env = {};

for (const line of envContent.split(/\r?\n/)) {
	if (!line || line.trim().startsWith("#")) continue;
	const idx = line.indexOf("=");
	if (idx === -1) continue;
	const key = line.slice(0, idx).trim();
	const value = line.slice(idx + 1).trim();
	env[key] = value;
}

const replacements = {
	__FIREBASE_API_KEY__: env.FIREBASE_API_KEY,
	__FIREBASE_AUTH_DOMAIN__: env.FIREBASE_AUTH_DOMAIN,
	__FIREBASE_DATABASE_URL__: env.FIREBASE_DATABASE_URL,
	__FIREBASE_PROJECT_ID__: env.FIREBASE_PROJECT_ID,
	__FIREBASE_STORAGE_BUCKET__: env.FIREBASE_STORAGE_BUCKET,
	__FIREBASE_MESSAGING_SENDER_ID__: env.FIREBASE_MESSAGING_SENDER_ID,
	__FIREBASE_APP_ID__: env.FIREBASE_APP_ID,
	__FIREBASE_MEASUREMENT_ID__: env.FIREBASE_MEASUREMENT_ID,
	__FIREBASE_VAPID_KEY__: env.FIREBASE_VAPID_KEY,
};

for (const file of files) {
	const p = path.join(root, file);
	let content = fs.readFileSync(p, "utf8");
	for (const [placeholder, value] of Object.entries(replacements)) {
		content = content.split(placeholder).join(value || "");
	}
	const outPath = path.join(root, "dist", file);
	fs.mkdirSync(path.dirname(outPath), { recursive: true });
	fs.writeFileSync(outPath, content, "utf8");
	console.log(`Built ${file} -> dist/${file}`);
}
