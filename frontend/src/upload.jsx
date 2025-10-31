import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { Bar, Pie, Line } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const BASE_COLORS = [
  "#FF0000", // red
  "#008000", // green
  "#FFFF00", // yellow
  "#36A2EB", // blue
  "#9966FF", // purple
  "#FF9F40", // orange
  "#4BC0C0", // teal
];

function generateColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(BASE_COLORS[i % BASE_COLORS.length]);
  }
  return colors;
}

function ExcelUploadAndCharts() {
  const [chartData, setChartData] = useState(null);
  const barRef = useRef(null);
  const pieRef = useRef(null);
  const lineRef = useRef(null);
  const fileInputRef = useRef(null);
  const dialogOpenedRef = useRef(false);

  useEffect(() => {
    // Only open file dialog once per mount
    if (!dialogOpenedRef.current && fileInputRef.current) {
      dialogOpenedRef.current = true;
      fileInputRef.current.click();
    }
  }, []);

  const handleFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (!jsonData || jsonData.length < 2) {
        alert("Excel file is empty or does not have enough data");
        return;
      }

      const headers = jsonData[0];
      const rows = jsonData
        .slice(1)
        .filter((row) => row.some((cell) => cell !== undefined && cell !== null && cell !== ""));

      const labels = rows.map((row) => row[0]?.toString() || "");

      const datasets = [];
      for (let col = 1; col < headers.length; col++) {
        const colDataRaw = rows.map((row) => row[col]);
        const numericValues = colDataRaw.map((val) =>
          val !== undefined && val !== null ? Number(val) : NaN
        );
        const numericCount = numericValues.filter((v) => !isNaN(v)).length;
        if (numericCount < colDataRaw.length / 2) continue;

        const cleanedData = numericValues.map((v) => (isNaN(v) ? 0 : v));

        datasets.push({
          label: headers[col],
          data: cleanedData,
          backgroundColor: BASE_COLORS[(col - 1) % BASE_COLORS.length],
          borderColor: BASE_COLORS[(col - 1) % BASE_COLORS.length],
          borderWidth: 1,
          fill: false,
          tension: 0.3,
          pointBackgroundColor: BASE_COLORS[(col - 1) % BASE_COLORS.length],
        });
      }

      if (labels.length === 0 || datasets.length === 0) {
        alert("No valid numeric data to plot.");
        return;
      }

      const pieDataset = datasets[0]
        ? {
            label: datasets[0].label,
            data: datasets[0].data,
            backgroundColor: generateColors(datasets[0].data.length),
          }
        : null;

      setChartData({
        bar: {
          labels,
          datasets: datasets.map(
            ({
              label,
              data,
              backgroundColor,
              borderColor,
              borderWidth,
            }) => ({
              label,
              data,
              backgroundColor,
              borderColor,
              borderWidth,
            })
          ),
        },
        pie: pieDataset
          ? {
              labels,
              datasets: [pieDataset],
            }
          : null,
        line: {
          labels,
          datasets: datasets.map(
            ({ label, data, borderColor, backgroundColor }) => ({
              label,
              data,
              borderColor,
              backgroundColor,
              fill: false,
              tension: 0.3,
              pointBackgroundColor: backgroundColor,
            })
          ),
        },
      });
    };
    reader.readAsBinaryString(file);
  };

  const exportSingleChartToPDF = (ref, filename) => {
    if (!ref?.current) return Promise.resolve();
    return html2canvas(ref.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape" });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);
    });
  };

  const downloadAllCharts = async () => {
    if (!chartData) return;
    await exportSingleChartToPDF(barRef, "bar_chart.pdf");
    if (chartData.pie) await exportSingleChartToPDF(pieRef, "pie_chart.pdf");
    await exportSingleChartToPDF(lineRef, "line_chart.pdf");
  };

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#333", font: { size: 14 } } },
      title: { display: true, font: { size: 18 }, color: "#222" },
      tooltip: { bodyFont: { size: 14 } },
      datalabels: {
        display: true,
        color: "#444",
        font: { weight: "bold", size: 12 },
        formatter: (value) => value,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Variables",
          font: { size: 16, weight: "bold" },
          color: "#333",
        },
        ticks: { color: "#333", font: { size: 14 } },
      },
      y: {
        title: {
          display: true,
          text: "Values",
          font: { size: 16, weight: "bold" },
          color: "#333",
        },
        ticks: { color: "#333", font: { size: 14 }, beginAtZero: true },
      },
    },
  };

  const pieOptions = {
    ...commonOptions,
    scales: {}, // Pie chart does not have scales
    plugins: {
      ...commonOptions.plugins,
      title: { ...commonOptions.plugins.title, text: "Pie Chart" },
      datalabels: {
        display: true,
        color: "#fff",
        font: { weight: "bold", size: 14 },
        formatter: (value) => value,
      },
    },
  };

  return (
    <div>
      <h3>Upload Excel File</h3>
      <input
        type="file"
        accept=".xlsx, .xls"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFile}
      />
      {/* No visible upload button here, file dialog auto-opens on mount */}
      {chartData && (
        <>
          <div ref={barRef} style={{ maxWidth: "700px", margin: "30px auto" }}>
            <Bar
              options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
                  title: {
                    ...commonOptions.plugins.title,
                    text: "Bar Chart",
                  },
                },
              }}
              data={chartData.bar}
            />
          </div>
          {chartData.pie && (
            <div ref={pieRef} style={{ maxWidth: "700px", margin: "30px auto" }}>
              <Pie options={pieOptions} data={chartData.pie} />
            </div>
          )}
          <div ref={lineRef} style={{ maxWidth: "700px", margin: "30px auto" }}>
            <Line
              options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
                  title: {
                    ...commonOptions.plugins.title,
                    text: "Line Chart",
                  },
                },
              }}
              data={chartData.line}
            />
          </div>
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button className="primary-btn" onClick={downloadAllCharts}>
              Download All Charts as PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ExcelUploadAndCharts;
