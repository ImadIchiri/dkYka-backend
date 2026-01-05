import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const { FB_PROJECT_ID, FB_PRIVATE_KEY, FB_CLIENT_EMAIL, FB_STORAGE_BUCKET } =
  process.env;

if (!FB_PROJECT_ID || !FB_PRIVATE_KEY || !FB_CLIENT_EMAIL || !FB_STORAGE_BUCKET) {
  throw new Error("Certaines variables Firebase ne sont pas définies");
}

const serviceAccount: admin.ServiceAccount = {
  projectId: FB_PROJECT_ID,
  clientEmail: FB_CLIENT_EMAIL,
  privateKey: FB_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: FB_STORAGE_BUCKET,
  });
}

const bucket = admin.storage().bucket();

export const uploadToFirebase = async (fileBuffer: Buffer, filepath: string) => {
  const ext = path.extname(filepath);
  const name = path.basename(filepath, ext);
  const finalPath = `media/${name}-${uuidv4()}${ext}`;
  const file = bucket.file(finalPath);
  const token = uuidv4();

  await file.save(fileBuffer, {
    metadata: { metadata: { firebaseStorageDownloadTokens: token } },
  });

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
    finalPath
  )}?alt=media&token=${token}`;
};

export const deleteFromFirebase = async (fileUrl: string) => {
  if (!fileUrl) return;

  try {
    const decodedUrl = decodeURIComponent(fileUrl);
    const pathStart = decodedUrl.indexOf("/o/") + 3;
    const pathEnd = decodedUrl.indexOf("?alt=");
    if (pathStart < 3 || pathEnd === -1) throw new Error("URL Firebase invalide");
    const filePath = decodedUrl.substring(pathStart, pathEnd);
    await bucket.file(filePath).delete();
  } catch (err) {
    console.error("Erreur suppression Firebase:", err);
    throw new Error("Impossible de supprimer le fichier Firebase");
  }
};
