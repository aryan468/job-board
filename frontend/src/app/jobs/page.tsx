"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const PAGE_SIZE = 5;
const PRIMARY_COLOR = "#0033A0"; // Naukri Blue
const SECONDARY_COLOR = "#F3F7FF";

type Job = {
  _id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  applyLink: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = () => {
    axios
      .get("http://localhost:5000/jobs")
      .then((response) => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setError("Failed to load jobs. Please try again.");
        setLoading(false);
      });
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-center mb-6" style={{ color: PRIMARY_COLOR }}>
        Job Listings
      </h1>
      <div className="w-full max-w-3xl mb-6">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {loading && <p className="text-center text-gray-500">Loading jobs...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      <div className="w-full max-w-3xl space-y-6">
        {paginatedJobs.length === 0 && !loading ? (
          <p className="text-center text-gray-500">No jobs found.</p>
        ) : (
          paginatedJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white shadow-lg p-5 rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl border-l-4"
              style={{ borderColor: PRIMARY_COLOR }}
            >
              <h2 className="text-xl font-semibold mb-2" style={{ color: PRIMARY_COLOR }}>
                {job.title}
              </h2>
              <p className="text-gray-700">
                <strong>{job.company}</strong> - {job.location}
              </p>
              <p className="text-gray-600">
                <strong>Experience:</strong> {job.experience}
              </p>
              <a
                href={job.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-5 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 hover:shadow-lg"
              >
                Apply Now
              </a>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center mt-6 space-x-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className={`px-5 py-2 rounded-md text-white font-medium transition ${
            currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Prev
        </button>
        <span className="text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className={`px-5 py-2 rounded-md text-white font-medium transition ${
            currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
