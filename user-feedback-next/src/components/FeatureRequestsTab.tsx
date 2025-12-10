import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { FeedbackCard } from "./FeedbackCard";
import { getSessionId } from "../lib/session";

const categories = ["UI/UX", "Integration", "Performance", "Mobile", "Other"];
const statuses = ["all", "under-review", "planned", "in-progress", "completed"];

export function FeatureRequestsTab({ user }: { user: any }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const submitFeatureRequest = useMutation(api.featureRequests.submitFeatureRequest);
  const featureRequests = useQuery(api.featureRequests.listFeatureRequests, {
    status: selectedStatus,
  });
  const userVotes = useQuery(api.feedback.getUserVotes, {
    sessionId: getSessionId(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await submitFeatureRequest({
        title: title.trim(),
        description: description.trim(),
        category,
        isAnonymous,
      });
      
      toast.success("Feature request submitted successfully!");
      setTitle("");
      setDescription("");
      setCategory(categories[0]);
      setIsAnonymous(false);
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to submit feature request");
    }
  };

  const votedItems = new Set(
    userVotes?.filter((v) => v.itemType === "feature").map((v) => v.itemId) || []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Feature Requests</h2>
          <p className="text-slate-600 mt-1">Suggest new features and improvements</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Request Feature
        </button>
      </div>

      {showForm && (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Feature Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What feature would you like to see?"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the feature and how it would help you"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous-feature"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="anonymous-feature" className="text-sm text-slate-700">
                Submit anonymously
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
              >
                Submit Request
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all border border-slate-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-2">
        <span className="text-sm font-semibold text-slate-700 self-center">Status:</span>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-300 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === "all" ? "All" : status.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {featureRequests === undefined ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
          </div>
        ) : featureRequests.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-lg font-medium">No feature requests yet</p>
            <p className="text-sm mt-1">Be the first to suggest a new feature!</p>
          </div>
        ) : (
          featureRequests.map((item) => (
            <FeedbackCard
              key={item._id}
              item={item}
              hasVoted={votedItems.has(item._id)}
              itemType="feature"
            />
          ))
        )}
      </div>
    </div>
  );
}
