import { useState } from "react";
import './ManagerExercise.scss';
import TableExercise from "./TableExercise";
import CreateExercise from "./CreateExercise";
import img from "../../../../assets/image/gym.jpg"
import { vietnameseDate } from "../../Util/DateOfTime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const ManagerExercise = () => {
    const [showModalCreateExercise, setShowModalCreateExercise] = useState(false);
    const [refreshTable, setRefreshTable] = useState(false);

    const handleDataAdded = () => {
        setRefreshTable(!refreshTable); // Làm mới danh sách Exercise
    };
    const vietnameseDate = new Date().toLocaleDateString("en-US", {
        weekday: "long", // Hiển thị ngày trong tuần
        year: "numeric", // Hiển thị năm
        month: "long", // Hiển thị tháng đầy đủ
        day: "numeric", // Hiển thị ngày
      });
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4 bg-light p-4 rounded shadow">
                <div className="d-flex align-items-center">
                    <img src={img} className="me-3"/>
                    <h1 className="h4 fw-bold text-primary">
                        Manager Exercise
                    </h1>
                </div>
                <div className="ms-auto">
                    <p className="text-muted fs-4 text-end">{vietnameseDate}</p>
                </div>
            </div>
            <br className="large-spacing" />
            <div className="exercise-content">
            <div className="d-flex justify-content-start mb-3">
  <button
    onClick={() => setShowModalCreateExercise(true)}
    className="btn-gradient rounded-pill d-flex align-items-center gap-2"
  >
    <FontAwesomeIcon icon={faPlus} />
    <span>Add Exercise</span>
  </button>
</div>

                <div className="table-exercise-container">
                    <TableExercise refresh={refreshTable} />
                </div>
                <CreateExercise
                    show={showModalCreateExercise}
                    setShow={setShowModalCreateExercise}
                    onAdd={handleDataAdded}
                />
            </div>
        </>
    );
};

export default ManagerExercise;
