import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function StudentRegistrations() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get(`/superadmin/students/${id}/registrations`);

      console.log(res.data); // 🔥 debug

      setStudent(res.data.student);
      setRegistrations(res.data.registrations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen p-6 bg-gradient-to-br from-purple-100 to-indigo-200">
        <div className="max-w-5xl mx-auto">

          {/* HEADER */}
          <div className="bg-white p-5 rounded-xl shadow mb-6">
            <h2 className="text-xl font-bold text-purple-800">
              {student?.name}
            </h2>
            <p className="text-sm text-gray-500">{student?.email}</p>
            <p className="text-sm text-gray-500">🏫 {student?.college}</p>
          </div>

          {/* REGISTRATIONS */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-bold mb-4 text-purple-800">
              Event Registrations
            </h3>

            {loading ? (
              <p>Loading...</p>
            ) : registrations.length === 0 ? (
              <p>No registrations</p>
            ) : (
              <div className="space-y-3">
                {registrations.map((reg) => {
                  const ev = reg.event_id || reg.event || {};

                  return (
                    <div
                      key={reg._id}
                      className="p-4 border rounded-xl flex justify-between"
                    >
                      <div>
                        <p className="font-semibold text-purple-900">
                          {ev.title || "No Event Name"}
                        </p>
                        <p className="text-sm text-gray-500">
                          📍 {ev.location || "-"}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          reg.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : reg.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {reg.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* BACK */}
          <Link
            to="/super-admin/students"
            className="inline-block mt-4 text-purple-600"
          >
            ← Back
          </Link>

        </div>
      </div>
    </>
  );
}