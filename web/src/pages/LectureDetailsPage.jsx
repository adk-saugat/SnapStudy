import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import SiteNav from "../components/SiteNav";
import DeleteLectureModal from "../components/lecture/DeleteLectureModal";
import EditLectureModal from "../components/lecture/EditLectureModal";
import LectureChaptersSection from "../components/lecture/LectureChaptersSection";
import LectureDetailsAlerts from "../components/lecture/LectureDetailsAlerts";
import LectureDetailsHeader from "../components/lecture/LectureDetailsHeader";
import LectureFilesTable from "../components/lecture/LectureFilesTable";
import UploadLectureImagesModal from "../components/lecture/UploadLectureImagesModal";
import {
  deleteLectureFile,
  deleteLecture,
  fetchLectureChapters,
  fetchLectureFiles,
  fetchUserLectures,
  updateLecture,
  uploadLectureImage,
} from "../api/lectureApi";
import { formatFileSize } from "../lib/formatFileSize";
import { formatRelativeTime } from "../lib/relativeTime";

function LectureDetailsPage() {
  const { lectureId } = useParams();
  const navigate = useNavigate();
  const [lectures, setLectures] = useState([]);
  const [loadState, setLoadState] = useState({ status: "loading" });
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [overlay, setOverlay] = useState(null);
  const [pending, setPending] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [lectureChapters, setLectureChapters] = useState([]);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [actionError, setActionError] = useState("");
  const actionsMenuRef = useRef(null);

  const loadLectureFiles = async () => {
    if (!lectureId) return;
    const response = await fetchLectureFiles(lectureId);
    const filesFromApi = Array.isArray(response?.files) ? response.files : [];
    setUploadedFiles(
      filesFromApi.map((file) =>
        typeof file === "string"
          ? { id: file, name: file, type: "Image", size: "-" }
          : {
              id: file?.id || file?.name || "unknown-file-id",
              name: file?.name || "Unknown file",
              type: file?.type || "Image",
              size: formatFileSize(file?.size_bytes),
            },
      ),
    );
  };

  const loadLectureChapters = async () => {
    if (!lectureId) return;
    const response = await fetchLectureChapters(lectureId);
    const chaptersFromApi = Array.isArray(response?.chapters) ? response.chapters : [];
    setLectureChapters(
      chaptersFromApi.map((chapter, index) => ({
        id: chapter?.id || `chapter-${index}`,
        title: chapter?.title || `Chapter ${index + 1}`,
        markdown: chapter?.markdown || "",
      })),
    );
  };

  useEffect(() => {
    const loadLectures = async () => {
      setLoadState({ status: "loading" });
      try {
        const response = await fetchUserLectures();
        const fetchedLectures = Array.isArray(response?.lectures)
          ? response.lectures
          : [];
        setLectures(fetchedLectures);
        if (lectureId) {
          const filesResponse = await fetchLectureFiles(lectureId);
          const filesFromApi = Array.isArray(filesResponse?.files) ? filesResponse.files : [];
          setUploadedFiles(
            filesFromApi.map((file) =>
              typeof file === "string"
                ? { id: file, name: file, type: "Image", size: "-" }
                : {
                    id: file?.id || file?.name || "unknown-file-id",
                    name: file?.name || "Unknown file",
                    type: file?.type || "Image",
                    size: formatFileSize(file?.size_bytes),
                  },
            ),
          );
          await loadLectureChapters();
        }
        setLoadState({ status: "ok" });
      } catch (error) {
        setLoadState({
          status: "error",
          message: error.message || "Unable to load lecture details",
        });
      }
    };

    loadLectures();
  }, [lectureId]);

  const lecture = useMemo(
    () => lectures.find((item) => item.id === lectureId),
    [lectures, lectureId],
  );

  const chapters = lectureChapters;
  const files = uploadedFiles;
  const activeChapter = chapters[activeChapterIndex];
  const updatedAt = `Updated ${formatRelativeTime(lecture?.updated_at)}`;

  const isLoading = loadState.status === "loading";
  const loadError = loadState.status === "error" ? loadState.message : "";

  useEffect(() => {
    setActiveChapterIndex(0);
  }, [lectureId]);

  useEffect(() => {
    if (!isActionMenuOpen) return undefined;

    const handleOutsideClick = (event) => {
      if (!actionsMenuRef.current?.contains(event.target)) {
        setIsActionMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isActionMenuOpen]);

  const closeOverlay = () => setOverlay(null);

  const handleImageFileChange = (event) => {
    const chosenFiles = Array.from(event.target.files || []);
    setOverlay((prev) =>
      prev?.type === "upload" ? { ...prev, files: chosenFiles, error: "" } : prev,
    );
  };

  const handleUploadImages = async (event) => {
    event.preventDefault();
    if (overlay?.type !== "upload") return;

    setOverlay((prev) => (prev?.type === "upload" ? { ...prev, error: "" } : prev));

    if (overlay.files.length === 0) {
      setOverlay((prev) =>
        prev?.type === "upload"
          ? { ...prev, error: "Please choose at least one image to upload." }
          : prev,
      );
      return;
    }

    const filesToUpload = overlay.files;
    setPending("upload");
    try {
      for (const file of filesToUpload) {
        const result = await uploadLectureImage(lectureId, file);
        console.log("UploadFile response:", result);
      }
      await loadLectureFiles();
      await loadLectureChapters();
      closeOverlay();
    } catch (error) {
      setOverlay((prev) =>
        prev?.type === "upload"
          ? { ...prev, error: error.message || "Upload failed" }
          : prev,
      );
    } finally {
      setPending(null);
    }
  };

  const handleOpenEditModal = () => {
    setActionError("");
    setOverlay({
      type: "edit",
      title: lecture?.title || "",
      description: lecture?.description || "",
    });
    setIsActionMenuOpen(false);
  };

  const handleEditFormChange = (updater) => {
    setOverlay((prev) => {
      if (prev?.type !== "edit") return prev;
      const next =
        typeof updater === "function"
          ? updater({ title: prev.title, description: prev.description })
          : updater;
      return { type: "edit", title: next.title, description: next.description };
    });
  };

  const handleSaveEditLecture = async (event) => {
    event.preventDefault();
    if (overlay?.type !== "edit") return;

    setActionError("");

    const normalizedTitle = overlay.title.trim() || "Untitled Lecture";
    const normalizedDescription = overlay.description.trim();

    setPending("save");
    try {
      const response = await updateLecture(lectureId, {
        title: normalizedTitle,
        description: normalizedDescription,
      });

      const updatedLecture = response?.lecture;
      setLectures((prev) =>
        prev.map((item) => {
          if (item.id !== lectureId) return item;
          if (!updatedLecture) {
            return {
              ...item,
              title: normalizedTitle,
              description: normalizedDescription,
              updated_at: new Date().toISOString(),
            };
          }

          return {
            ...item,
            ...updatedLecture,
          };
        }),
      );
      closeOverlay();
    } catch (error) {
      setActionError(error.message || "Unable to update lecture");
    } finally {
      setPending(null);
    }
  };

  const handleOpenDeleteModal = () => {
    setIsActionMenuOpen(false);
    setActionError("");
    setOverlay({ type: "delete" });
  };

  const handleDeleteLecture = async () => {
    setActionError("");

    setPending("delete");
    try {
      await deleteLecture(lectureId);
      setLectures((prev) => prev.filter((item) => item.id !== lectureId));
      closeOverlay();
      navigate("/dashboard");
    } catch (error) {
      setActionError(error.message || "Unable to delete lecture");
    } finally {
      setPending(null);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!lectureId || !fileId) return;

    setActionError("");
    setPending(`delete-file-${fileId}`);
    try {
      await deleteLectureFile(lectureId, fileId);
      await loadLectureFiles();
      await loadLectureChapters();
    } catch (error) {
      setActionError(error.message || "Unable to delete file");
    } finally {
      setPending(null);
    }
  };

  const showNotFound = loadState.status === "ok" && !lecture;

  const uploadOverlay = overlay?.type === "upload" ? overlay : null;
  const editOverlay = overlay?.type === "edit" ? overlay : null;

  useEffect(() => {
    if (activeChapterIndex >= chapters.length) {
      setActiveChapterIndex(0);
    }
  }, [chapters.length, activeChapterIndex]);

  return (
    <div className="page-shell">
      <SiteNav>
        <div className="flex flex-wrap gap-2">
          <ActionButton to="/login" variant="secondary">
            Log Out
          </ActionButton>
        </div>
      </SiteNav>

      <main className="mx-auto w-[94vw] max-w-7xl py-8 md:py-10">
        <Link
          to="/dashboard"
          aria-label="Back to dashboard"
          className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-orange-300 bg-white text-xl font-semibold text-orange-900 shadow-sm transition hover:bg-orange-100"
        >
          &larr;
        </Link>

        <LectureDetailsAlerts
          isLoading={isLoading}
          loadError={loadError}
          actionError={actionError}
          showNotFound={showNotFound}
        />

        {lecture ? (
          <>
            <LectureDetailsHeader
              lecture={lecture}
              updatedAt={updatedAt}
              actionsMenuRef={actionsMenuRef}
              isActionMenuOpen={isActionMenuOpen}
              onToggleActionMenu={() => setIsActionMenuOpen((prev) => !prev)}
              onUploadImages={() =>
                setOverlay({ type: "upload", files: [], error: "" })
              }
              onEditLecture={handleOpenEditModal}
              onDeleteLecture={handleOpenDeleteModal}
              isDeletingLecture={pending === "delete"}
            />

            <LectureFilesTable
              files={files}
              onDeleteFile={handleDeleteFile}
              deletingFileId={pending?.startsWith("delete-file-") ? pending.replace("delete-file-", "") : null}
            />

            <LectureChaptersSection
              chapters={chapters}
              activeChapterIndex={activeChapterIndex}
              onSelectChapter={setActiveChapterIndex}
              activeChapter={activeChapter}
            />
          </>
        ) : null}
      </main>

      <UploadLectureImagesModal
        isOpen={uploadOverlay != null}
        selectedImages={uploadOverlay?.files ?? []}
        error={uploadOverlay?.error ?? ""}
        isSubmitting={pending === "upload"}
        onClose={closeOverlay}
        onSubmit={handleUploadImages}
        onFileChange={handleImageFileChange}
      />
      <EditLectureModal
        isOpen={editOverlay != null}
        editForm={
          editOverlay
            ? { title: editOverlay.title, description: editOverlay.description }
            : { title: "", description: "" }
        }
        onEditFormChange={handleEditFormChange}
        onSubmit={handleSaveEditLecture}
        onClose={closeOverlay}
        isSaving={pending === "save"}
      />
      <DeleteLectureModal
        isOpen={overlay?.type === "delete"}
        lectureTitle={lecture?.title}
        onConfirm={handleDeleteLecture}
        onClose={closeOverlay}
        isDeleting={pending === "delete"}
      />
    </div>
  );
}

export default LectureDetailsPage;
