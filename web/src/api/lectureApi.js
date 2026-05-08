const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function assertOk(response, data, fallbackMessage) {
  if (response.ok) return;
  const message = data?.error || data?.message || fallbackMessage;
  const err = new Error(message);
  err.code = data?.code;
  throw err;
}

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
  assertOk(response, data, "Create lecture request failed");
  return data;
}

export async function fetchUserLectures() {
  const response = await fetch(`${API_BASE_URL}/lectures`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));
  assertOk(response, data, "Fetch lectures request failed");
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
  assertOk(response, data, "Update lecture request failed");
  return data;
}

export async function deleteLecture(lectureId) {
  const response = await fetch(`${API_BASE_URL}/lectures/${lectureId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));
  assertOk(response, data, "Delete lecture request failed");
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
  assertOk(response, data, "Upload image request failed");
  return data;
}

export async function fetchLectureFiles(lectureId) {
  const response = await fetch(`${API_BASE_URL}/lectures/${lectureId}/files`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));
  assertOk(response, data, "Fetch lecture files request failed");
  return data;
}

export async function fetchLectureChapters(lectureId) {
  const response = await fetch(`${API_BASE_URL}/lectures/${lectureId}/chapters`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));
  assertOk(response, data, "Fetch lecture chapters request failed");
  return data;
}

function parseFilenameFromContentDisposition(header) {
  if (!header || typeof header !== "string") {
    return null;
  }
  const utf8Match = /filename\*=UTF-8''([^;\s]+)/i.exec(header);
  if (utf8Match) {
    try {
      return decodeURIComponent(utf8Match[1].replace(/^"+|"+$/g, ""));
    } catch {
      return utf8Match[1];
    }
  }
  const quotedMatch = /filename="([^"]+)"/i.exec(header);
  if (quotedMatch) {
    return quotedMatch[1];
  }
  const plainMatch = /filename=([^;\s]+)/i.exec(header);
  if (plainMatch) {
    return plainMatch[1].replace(/^"+|"+$/g, "");
  }
  return null;
}

/** Mirrors server filename rules: safe ASCII + dashes, max length, always ends in .pdf */
function sanitizeTitleForPdfFilename(title, emptyFallbackFile) {
  const trimmed = (title || "").trim();
  if (!trimmed) {
    return emptyFallbackFile;
  }
  let out = "";
  let count = 0;
  for (const ch of trimmed) {
    if (count >= 80) break;
    if (/[a-zA-Z0-9]/.test(ch)) {
      out += ch;
      count++;
    } else if (ch === " " || ch === "-" || ch === "_") {
      out += "-";
      count++;
    }
  }
  out = out.replace(/^-+|-+$/g, "");
  if (!out) {
    return emptyFallbackFile;
  }
  return /\.pdf$/i.test(out) ? out : `${out}.pdf`;
}

/**
 * GET /lectures/:lectureId/pdf — downloads the combined lecture PDF (all chapters).
 * @param {string} [lectureTitle] — fallback filename when Content-Disposition is missing.
 */
export async function downloadLecturePDF(lectureId, lectureTitle) {
  const response = await fetch(`${API_BASE_URL}/lectures/${lectureId}/pdf`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    assertOk(response, data, "Download lecture PDF failed");
  }

  const blob = await response.blob();
  const headerFilename = parseFilenameFromContentDisposition(
    response.headers.get("Content-Disposition"),
  );
  const filename =
    headerFilename || sanitizeTitleForPdfFilename(lectureTitle, "lecture.pdf");

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

/**
 * GET /lectures/:lectureId/chapters/:chapterId/pdf — downloads PDF for one chapter only.
 * @param {string} chapterTitle — used for the saved filename when the header is missing (not sent in the URL).
 */
export async function downloadChapterPDF(lectureId, chapterId, chapterTitle) {
  const response = await fetch(
    `${API_BASE_URL}/lectures/${lectureId}/chapters/${chapterId}/pdf`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    assertOk(response, data, "Download chapter PDF failed");
  }

  const blob = await response.blob();
  const headerFilename = parseFilenameFromContentDisposition(
    response.headers.get("Content-Disposition"),
  );
  const filename =
    headerFilename || sanitizeTitleForPdfFilename(chapterTitle, "chapter.pdf");

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

export async function deleteLectureFile(lectureId, fileId) {
  const response = await fetch(`${API_BASE_URL}/lectures/${lectureId}/files/${fileId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));
  assertOk(response, data, "Delete lecture file request failed");
  return data;
}
