import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { Project } from "../types";
import { DocumentTextIcon, AcademicCapIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export const ProjectDetailsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;

      try {
        const projectRef = doc(db, "projects", projectId);
        const projectSnap = await getDoc(projectRef);

        if (projectSnap.exists()) {
          setProject({
            ...projectSnap.data(),
            projectId: projectSnap.id,
          } as Project);
        } else {
          setError("Project not found");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/dashboard"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        Back to Dashboard
      </Link>

      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {project.projectName}
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <DocumentTextIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
              {project.knowledgeURL
                ? "Document uploaded"
                : "No document uploaded"}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <AcademicCapIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
              {project.quizGenerated ? "Quiz available" : "No quiz generated"}
            </div>
          </div>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <span>
            <button
              type="button"
              onClick={() => navigate(`/projects/${projectId}/quiz/configure`)}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <AcademicCapIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
              Generate Quiz
            </button>
          </span>
        </div>
      </div>

      <div className="mt-8 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Project Description
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>{project.description}</p>
          </div>
        </div>
      </div>

      {project.knowledgeURL && (
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Project Knowledge
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Your uploaded document is ready for quiz generation.</p>
            </div>
            <div className="mt-3">
              <a
                href={project.knowledgeURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <DocumentTextIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
                View Document
              </a>
            </div>
          </div>
        </div>
      )}

      {project.quizGenerated &&
        project.quizIds &&
        project.quizIds.length > 0 && (
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Generated Quizzes
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  {project.quizIds.length === 1
                    ? "A quiz has been generated for this project."
                    : `${project.quizIds.length} quizzes have been generated for this project.`}
                </p>
              </div>
              <div className="mt-3 space-y-2">
                {project.quizIds.map((quizId, index) => (
                  <button
                    key={quizId}
                    onClick={() =>
                      navigate(`/projects/${projectId}/quiz/${quizId}`)
                    }
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2"
                  >
                    <AcademicCapIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
                    Take Quiz{" "}
                    {project.quizIds.length > 1 ? `#${index + 1}` : ""}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};
