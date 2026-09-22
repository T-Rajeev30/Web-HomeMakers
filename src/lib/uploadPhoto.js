import api from "../services/api";

const normalizeContentType = (type) =>
  type === "image/png" ? "image/png" : "image/jpeg";

// Returns the S3 key so callers (readyPhoto, kitchen/profile photos) can use it.
export async function uploadPhoto(type, file) {
  const contentType = normalizeContentType(file.type);
  const { data: presignData } = await api.post("/api/uploads/presign", {
    type,
    contentType,
  });
  await fetch(presignData.url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });
  await api.post("/api/uploads/confirm", { type, key: presignData.key });
  return presignData.key;
}
