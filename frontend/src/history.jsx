import React, { useEffect, useState } from "react";

function History({ user }) {
  const [uploadHistory, setUploadHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUploadHistory() {
      try {
        const response = await fetch(
          `http://localhost:4000/api/user/uploads?userId=${user._id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch upload history");
        }
        const data = await response.json();
        setUploadHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchUploadHistory();
  }, [user]);

  if (loading)
    return <p style={styles.message}>Loading your upload history...</p>;
  if (error) return <p style={styles.message}>Error: {error}</p>;
  if (uploadHistory.length === 0)
    return <p style={styles.message}>You have no recorded uploads yet.</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Upload History</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Filename</th>
          </tr>
        </thead>
        <tbody>
          {uploadHistory.map(({ filename, _id }) => (
            <tr key={_id} style={styles.tr}>
              <td style={styles.td}>{filename || "Unnamed file"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    width: "100%",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "20px",
    color: "#333",
  },
  table: {
    width: "50%",
    minWidth: "250px",
    maxWidth: "600px",
    margin: "0 auto",
    borderCollapse: "collapse",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  th: {
    backgroundColor: "#4a90e2",
    color: "#fff",
    padding: "12px",
    border: "1px solid #ddd",
    fontWeight: "bold",
    fontSize: "16px",
  },
  tr: {
    borderBottom: "1px solid #ddd",
  },
  td: {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "center",
    fontSize: "15px",
  },
  message: {
    textAlign: "center",
    marginTop: "40px",
    fontSize: "18px",
    color: "#555",
  },
};

export default History;
