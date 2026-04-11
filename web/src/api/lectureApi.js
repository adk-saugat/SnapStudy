const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function createLecture(payload) {
  const response = await fetch(`${API_BASE_URL}/lectures`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error || data?.message || "Create lecture request failed";
    throw new Error(message);
  }

  return data;
}

export async function fetchUserLectures() {
  const response = await fetch(`${API_BASE_URL}/lectures`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error || data?.message || "Fetch lectures request failed";
    throw new Error(message);
  }

  return data;
}

export async function updateLecture(lectureId, payload) {
  const response = await fetch(`${API_BASE_URL}/lectures/${lectureId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error || data?.message || "Update lecture request failed";
    throw new Error(message);
  }

  return data;
}

export async function deleteLecture(lectureId) {
  const response = await fetch(`${API_BASE_URL}/lectures/${lectureId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error || data?.message || "Delete lecture request failed";
    throw new Error(message);
  }

  return data;
}

/**
 * POST /lectures/:lectureId/files — multipart field name must be "image" (matches server).
 */
export async function uploadLectureImage(lectureId, file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/lectures/${lectureId}/files`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error || data?.message || "Upload image request failed";
    throw new Error(message);
  }

  return data;
}
