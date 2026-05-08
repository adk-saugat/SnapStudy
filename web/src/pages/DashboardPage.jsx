import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import SiteNav from "../components/SiteNav";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import LectureListSection from "../components/dashboard/LectureListSection";
import CreateLectureModal from "../components/dashboard/CreateLectureModal";
import { logoutUser } from "../api/authApi";
import { fetchBillingStatus } from "../api/billingApi";
import {
  createLecture,
  fetchLectureChapters,
  fetchLectureFiles,
  fetchUserLectures,
} from "../api/lectureApi";
import { formatRelativeTime } from "../lib/relativeTime";

function getSavedUsername() {
  try {
    const savedUser = localStorage.getItem("snapstudy_user");
    if (!savedUser) return "Student";
    const parsedUser = JSON.parse(savedUser);
    return parsedUser?.username || "Student";
  } catch {
    return "Student";
  }
}

function DashboardPage() {
  const navigate = useNavigate();
  const [lectureList, setLectureList] = useState([]);
  const [isFetchingLectures, setIsFetchingLectures] = useState(true);
  const [fetchLecturesError, setFetchLecturesError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatingLecture, setIsCreatingLecture] = useState(false);
  const [createLectureError, setCreateLectureError] = useState("");
  const [createLectureForm, setCreateLectureForm] = useState({
    title: "",
    description: "",
  });
  const username = getSavedUsername();

  const normalizeLecture = (lecture) => {
    return {
      id: lecture?.id,
      title: lecture?.title || "Untitled Lecture",
      description: lecture?.description || "",
      updatedAt: `Updated ${formatRelativeTime(lecture?.updated_at)}`,
      files: [],
      chapters: [],
      chapterCount: 0,
    };
  };

  useEffect(() => {
    let cancelled = false;

    const loadLectures = async () => {
      setFetchLecturesError("");
      setIsFetchingLectures(true);
      try {
        const response = await fetchUserLectures();
        const baseLectures = Array.isArray(response?.lectures)
          ? response.lectures.map(normalizeLecture)
          : [];

        const fetchedLectures = [];
        for (const lecture of baseLectures) {
          try {
            const filesResponse = await fetchLectureFiles(lecture.id);
            const files = Array.isArray(filesResponse?.files)
              ? filesResponse.files
              : [];
            const chaptersResponse = await fetchLectureChapters(lecture.id);
            const chapters = Array.isArray(chaptersResponse?.chapters)
              ? chaptersResponse.chapters
              : [];
            fetchedLectures.push({
              ...lecture,
              files,
              chapters,
              chapterCount: chapters.length,
            });
          } catch {
            fetchedLectures.push(lecture);
          }
        }
        if (!cancelled) {
          setLectureList(fetchedLectures);
        }
      } catch (error) {
        if (error.code === "SUBSCRIPTION_REQUIRED") {
          navigate("/subscribe", { replace: true });
          return;
        }
        if (!cancelled) {
          setFetchLecturesError(error.message || "Unable to load lectures");
        }
      } finally {
        if (!cancelled) {
          setIsFetchingLectures(false);
        }
      }
    };

    (async () => {
      try {
        const status = await fetchBillingStatus();
        if (cancelled) return;
        const raw = localStorage.getItem("snapstudy_user");
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.subscription_active = status.subscription_active;
          parsed.trial_active = status.trial_active;
          parsed.has_premium_access = status.has_premium_access;
          if (status.trial_ends_at) {
            parsed.trial_ends_at = status.trial_ends_at;
          }
          localStorage.setItem("snapstudy_user", JSON.stringify(parsed));
        }
        if (!status.has_premium_access) {
          if (!cancelled) {
            setIsFetchingLectures(false);
          }
          navigate("/subscribe", { replace: true });
          return;
        }
        await loadLectures();
      } catch {
        if (!cancelled) {
          setIsFetchingLectures(false);
          navigate("/login", { replace: true });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleLogout = async () => {
    setLogoutError("");
    setIsLoggingOut(true);

    try {
      await logoutUser();
      localStorage.removeItem("snapstudy_user");
      navigate("/login");
    } catch (error) {
      setLogoutError(error.message || "Unable to log out");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setCreateLectureError("");
  };

  const handleCreateLectureFormChange = (field, value) => {
    setCreateLectureForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateLecture = async (event) => {
    event.preventDefault();
    setCreateLectureError("");
    setIsCreatingLecture(true);

    try {
      const response = await createLecture(createLectureForm);
      const createdLecture = response?.lecture;

      if (createdLecture) {
        setLectureList((prev) => [normalizeLecture(createdLecture), ...prev]);
      }

      setCreateLectureForm({ title: "", description: "" });
      setIsCreateModalOpen(false);
    } catch (error) {
      setCreateLectureError(error.message || "Unable to create lecture");
    } finally {
      setIsCreatingLecture(false);
    }
  };

  const totalLectures = lectureList.length;
  const totalUploadedFiles = lectureList.reduce(
    (total, lecture) => total + lecture.files.length,
    0,
  );
  const totalChapters = lectureList.reduce(
    (total, lecture) =>
      total + (lecture.chapterCount ?? lecture.chapters.length ?? 0),
    0,
  );
  const stats = [
    {
      label: "Lectures",
      value: totalLectures,
      subtitle: "Your study sessions",
    },
    {
      label: "Uploaded Files",
      value: totalUploadedFiles,
      subtitle: "Images, PDFs, and audio",
    },
    {
      label: "Chapters",
      value: totalChapters,
      subtitle: "Structured study notes",
    },
  ];

  return (
    <div className="page-shell">
      <SiteNav>
        <div className="flex flex-wrap gap-2">
          <ActionButton onClick={handleLogout} variant="secondary">
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </ActionButton>
        </div>
      </SiteNav>

      <main className="mx-auto w-[94vw] max-w-7xl py-8 md:py-10">
        <DashboardHeader
          username={username}
          logoutError={logoutError}
          onOpenCreateLecture={() => setIsCreateModalOpen(true)}
        />

        <DashboardStats stats={stats} />

        <LectureListSection
          lectureList={lectureList}
          isLoading={isFetchingLectures}
          error={fetchLecturesError}
        />
      </main>

      <CreateLectureModal
        isOpen={isCreateModalOpen}
        form={createLectureForm}
        error={createLectureError}
        isSubmitting={isCreatingLecture}
        onClose={handleModalClose}
        onSubmit={handleCreateLecture}
        onChange={handleCreateLectureFormChange}
      />
    </div>
  );
}

export default DashboardPage;
