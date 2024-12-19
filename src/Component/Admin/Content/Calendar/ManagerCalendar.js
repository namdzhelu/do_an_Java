import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { vietnameseDate } from "../../Util/DateOfTime";
import img from "../../../../assets/image/gym.jpg"
import DeleteCalendar from "./DeleteCalendar";
import UpdateCalendar from "./UpdateCalendar";
import CreateCalendar from "./CreateCalendar";

const ManagerCalendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false); // Modal trạng thái tạo mới
  const itemsPerPage = 4;

  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const fetchCalendarData = async () => {
    try {
      const response = await axiosInstance.get(
        "http://localhost:8080/calendar/getAllCalendar"
      );
      if (Array.isArray(response.data.calendarEntries)) {
        setCalendarData(response.data.calendarEntries);
      } else {
        console.error("Dữ liệu calendarEntries không phải mảng");
        setCalendarData([]);
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  };
  const handleAttendanceChange = async (calendarId, status) => {
    try {
      await axiosInstance.put(
        `http://localhost:8080/calendar/updateAttendance/${calendarId}`,
        { attendanceStatus: status }
      );
      fetchCalendarData(); 
    } catch (error) {
      console.error("Error updating attendance status:", error);
    }
  };
  
  useEffect(() => {
    fetchCalendarData();
  }, []);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleCloseModal = () => {
    setSelectedCalendar(null);
    setShowCreateModal(false); 
  };

  const handleRefreshCalendar = () => {
    fetchCalendarData(); 
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 bg-light p-4 rounded shadow">
                <div className="d-flex align-items-center">
                    <img src={img} className="me-3" />
                    <h1 className="h4 fw-bold text-primary">
                        Manager Calendar
                    </h1>
                </div>
                <div className="ms-auto">
                    <p className="text-muted fs-4 text-end">{vietnameseDate}</p>
                </div>
                <p className="text-muted fs-5"></p>
            </div>
      <div className="d-flex justify-content-start mb-3">
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowCreateModal(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Calendar
        </button>
      </div>
      <h4 style={{ textAlign: "center" }}>Calendar Management</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Roll Attendance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {calendarData
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((calendar) => (
              <tr key={calendar.calendarId}>
                <td>{`${calendar.client.firstName} ${calendar.client.lastName}`}</td>
                <td>{calendar.date}</td>
                <td>{calendar.timestart}</td>
                <td>{calendar.timeend}</td>
                <td>
<div className="form-check form-check-inline">
  <input
    className="form-check-input"
    type="radio"
    name={`attendance_${calendar.calendarId}`}
    value="1"
    checked={Number(calendar.attendanceStatus) === 1}
    onChange={() => handleAttendanceChange(calendar.calendarId, 1)}
  />
  <label className="form-check-label">Present</label>
</div>
<div className="form-check form-check-inline">
  <input
    className="form-check-input"
    type="radio"
    name={`attendance_${calendar.calendarId}`}
    value="0"
    checked={Number(calendar.attendanceStatus) === 0}
    onChange={() => handleAttendanceChange(calendar.calendarId, 0)}
  />
  <label className="form-check-label">Absent</label>
</div>
</td>


                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => setSelectedCalendar(calendar)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <DeleteCalendar
                    calendarId={calendar.calendarId}
                    refreshCalendar={fetchCalendarData}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <ReactPaginate
        nextLabel=">"
        onPageChange={handlePageChange}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={Math.ceil(calendarData.length / itemsPerPage)}
        previousLabel="<"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
      />

      {/* Modal chỉnh sửa */}
      {selectedCalendar && (
        <UpdateCalendar
          selectedCalendar={selectedCalendar}
          refreshCalendar={handleRefreshCalendar}
          onClose={handleCloseModal}
        />
      )}

      {/* Modal tạo mới */}
      {showCreateModal && (
        <CreateCalendar
          onClose={handleCloseModal}
          refreshCalendar={handleRefreshCalendar}
        />
      )}
    </div>
  );
};

export default ManagerCalendar;