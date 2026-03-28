import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import SiteNav from "../components/SiteNav";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import LectureListSection from "../components/dashboard/LectureListSection";
import CreateLectureModal from "../components/dashboard/CreateLectureModal";
import { logoutUser } from "../api/authApi";
import { createLecture, fetchUserLectures } from "../api/lectureApi";

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
    const updatedTimeLabel = lecture?.updated_at
      ? new Date(lecture.updated_at).toLocaleString()
      : "Unknown update time";

    return {
      id: lecture?.id,
      title: lecture?.title || "Untitled Lecture",
      updatedAt: `Updated ${updatedTimeLabel}`,
      files: [],
      chapters: [],
    };
  };

  useEffect(() => {
    const loadLectures = async () => {
      setFetchLecturesError("");
      setIsFetchingLectures(true);
      try {
        const response = await fetchUserLectures();
        const fetchedLectures = Array.isArray(response?.lectures)
          ? response.lectures.map(normalizeLecture)
          : [];
        setLectureList(fetchedLectures);
      } catch (error) {
        setFetchLecturesError(error.message || "Unable to load lectures");
      } finally {
        setIsFetchingLectures(false);
      }
    };

    loadLectures();
  }, []);

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
        setLectureList((prev) => [
          normalizeLecture(createdLecture),
          ...prev,
        ]);
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
    (total, lecture) => total + lecture.chapters.length,
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
