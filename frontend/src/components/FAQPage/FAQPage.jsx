import React, { useState, useEffect } from "react";
import "./FAQPage.css";
import { getAllQuestion, deleteQuestion } from "../../services/Q&AService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight, faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const FAQPage = () => {
  const [listQuestion, setListQuestion] = useState([]);
  const [isSpecified, setIsSpecified] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState({
    currentPage: 1,
    startIndex: 0,
    endIndex: 5,
  });
  const navigate = useNavigate();
  var userData = localStorage.getItem("user");
  userData = JSON.parse(userData);
  const handlePageClick = (page) => {
    const end = (page - 1) * 5 + 5;
    setActivePage({
      currentPage: page,
      startIndex: end - 5,
      endIndex: end < listQuestion.length ? end : listQuestion.length,
    });
  };

  const handlePrevious = () => {
    if (activePage.currentPage > 1) {
      setActivePage((prev) => ({
        currentPage: prev.currentPage - 1,
        startIndex: prev.startIndex - 5,
        endIndex: prev.endIndex - 5,
      }));
    }
  };

  const handleNext = () => {
    if (activePage.currentPage < pages.length) {
      setActivePage((prev) => ({
        currentPage: prev.currentPage + 1,
        startIndex: prev.startIndex + 5,
        endIndex: prev.endIndex + 5,
      }));
    }
  };
  const handleChangeSpecified = () => {
    setIsSpecified(!isSpecified);
  };
  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };
  const handleSearchResult = (result) => {
    setSearchResult(result);
    setSearchInput("");
  };
  const handleSearchButton = () => {
    setSearchResult(searchInput.trim());
    setSearchInput("");
  };
  const handleClickEdit = (data) => {
    navigate("/qa/answer-question", { state: data });
  };
  const handleDeleteQuestion = (id) => {
    Swal.fire({
      title: "Xóa câu hỏi",
      text: "Bạn chắc chắn muốn xóa câu hỏi ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Chắc chắn",
      confirmButtonColor: "orange",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteQuestion(id);
        if (response) {
          Swal.fire("Xóa thành công", "Câu hỏi đã được xóa", "success");
          window.location.reload();
        } else {
          Swal.fire("Lỗi", "Lỗi khi xóa câu hỏi", "error");
        }
      }
    });
  };
  useEffect(() => {
    const getListQuestion = async () => {
      const list_question = await getAllQuestion();
      if (list_question.question) {
        setListQuestion(list_question.question);
      } else {
        console.error("Lỗi khi lấy câu hỏi");
      }
    };
    getListQuestion();
  }, []);
  useEffect(() => {
    const specifiedQuestion = listQuestion.filter(
      (question) =>
        question.answer != null &&
        question.question.toLowerCase().includes(searchResult.toLowerCase())
    );
    const n = Math.ceil(specifiedQuestion.length / 5);
    setPages(Array.from({ length: n }, (_, i) => i + 1));
  }, [listQuestion]);
  useEffect(() => {
    if (isSpecified && userData.role != "manager") {
      const specifiedQuestion = listQuestion.filter(
        (question) =>
          question.asker_id == userData.id &&
          question.question.toLowerCase().includes(searchResult.toLowerCase())
      );
      const n = Math.ceil(specifiedQuestion.length / 5);
      setPages(Array.from({ length: n }, (_, i) => i + 1));
    } else if (isSpecified && userData.role == "manager") {
      const specifiedQuestion = listQuestion.filter(
        (question) =>
          question.answer == null &&
          question.question.toLowerCase().includes(searchResult.toLowerCase())
      );
      const n = Math.ceil(specifiedQuestion.length / 5);
      setPages(Array.from({ length: n }, (_, i) => i + 1));
    } else {
      const specifiedQuestion = listQuestion.filter(
        (question) =>
          question.answer != null &&
          question.question.toLowerCase().includes(searchResult.toLowerCase())
      );
      const n = Math.ceil(specifiedQuestion.length / 5);
      setPages(Array.from({ length: n }, (_, i) => i + 1));
    }
  }, [isSpecified, searchResult]);

  return (
    <>
      <div className="header">
        <h1 className="header-title">FAQ</h1>
        <p className="header-desc">Câu hỏi thường gặp</p>
        <div className="search">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              handleSearchInput(e);
            }}
            placeholder="Tìm câu hỏi"
          />
          <button onClick={handleSearchButton}>Tìm kiếm</button>
        </div>
        <div
          className={
            searchInput.length <= 0 ||
            listQuestion.filter((question) =>
              question.question
                .toLowerCase()
                .includes(searchInput.toLowerCase())
            ).length <= 0
              ? "d-none"
              : "dropdown-search"
          }
        >
          {listQuestion
            .filter((question) =>
              question.question
                .toLowerCase()
                .includes(searchInput.toLowerCase())
            )
            .map((question) => (
              <div
                className="dropdown-row text-dark"
                onClick={() => {
                  handleSearchResult(question.question);
                }}
              >
                {question.question}
              </div>
            ))}
        </div>
      </div>
      <div className="faq">
        <div className="faq-name">
          <h1 className="faq-header">
            {userData.role == "manager"
              ? "Quản lý câu hỏi"
              : "Đặt câu hỏi cho chúng tôi"}
          </h1>
          <img
            className="w-100 faq-image"
            src="public/FAQ-image.svg"
            alt="FAQ Image"
          />
          {userData.role != "manager" && (
            <button className="btn btn-warning rounded-pill btn-question">
              <a
                className="text-decoration-none text-dark"
                href={`/qa/create-question?id=${userData.id}`}
              >
                Đặt câu hỏi
              </a>
            </button>
          )}
        </div>
        <div className="faq-box">
          <nav aria-label="Page navigation example">
            <ul class="pagination">
              <li
                class={isSpecified ? "page-item" : "page-item active"}
                onClick={handleChangeSpecified}
              >
                <a class="page-link">
                  {userData.role != "manager"
                    ? "CÂU HỎI THƯỜNG GẶP"
                    : "DANH SÁCH CÂU HỎI"}
                </a>
              </li>
              <li
                class={isSpecified ? "page-item active" : "page-item"}
                onClick={handleChangeSpecified}
              >
                <a class="page-link">
                  {userData.role != "manager"
                    ? "CÂU HỎI CỦA BẠN"
                    : "CÂU HỎI CHƯA TRẢ LỜI"}
                </a>
              </li>
            </ul>
          </nav>
          {!isSpecified &&
            listQuestion
              .filter(
                (question) =>
                  question.answer != null &&
                  question.question
                    .toLowerCase()
                    .includes(searchResult.toLowerCase())
              )
              .slice(activePage.startIndex, activePage.endIndex)
              .map((question, index) => (
                <div className="faq-wrapper">
                  <input
                    type="checkbox"
                    className="faq-trigger"
                    id={`faq-trigger-${index + 1}`}
                  />
                  <label className="faq-title" for={`faq-trigger-${index + 1}`}>
                    {question.question}
                  </label>
                  <div className="faq-detail">
                    <p>{question.answer}</p>
                    {userData.role == "manager" && (
                      <>
                        <button
                          className="btn btn-warning"
                          onClick={() => {
                            handleClickEdit(question);
                          }}
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          className="btn btn-secondary btn-cancel"
                          onClick={() => {
                            handleDeleteQuestion(question.id);
                          }}
                        >
                          Xóa
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
          {isSpecified &&
            userData.role != "manager" &&
            listQuestion
              .filter(
                (question) =>
                  question.asker_id == userData.id &&
                  question.question
                    .toLowerCase()
                    .includes(searchResult.toLowerCase())
              )
              .slice(activePage.startIndex, activePage.endIndex)
              .map((question, index) => (
                <div className="faq-wrapper">
                  <input
                    type="checkbox"
                    className="faq-trigger"
                    id={`faq-trigger-${index + 1}`}
                  />
                  <label className="faq-title" for={`faq-trigger-${index + 1}`}>
                    {question.question}
                  </label>
                  <div className="faq-detail">
                    <p>
                      {question.answer != null
                        ? question.answer
                        : "Hiện chưa được trả lời"}
                    </p>
                  </div>
                </div>
              ))}
          {isSpecified &&
            userData.role == "manager" &&
            listQuestion
              .filter(
                (question) =>
                  question.answer == null &&
                  question.question
                    .toLowerCase()
                    .includes(searchResult.toLowerCase())
              )
              .slice(activePage.startIndex, activePage.endIndex)
              .map((question, index) => (
                <div className="faq-wrapper">
                  <input
                    type="checkbox"
                    className="faq-trigger"
                    id={`faq-trigger-${index + 1}`}
                  />
                  <label className="faq-title" for={`faq-trigger-${index + 1}`}>
                    {question.question}
                  </label>
                  <div className="faq-detail">
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        handleClickEdit(question);
                      }}
                    >
                      Trả lời
                    </button>
                    <button
                      className="btn btn-secondary btn-cancel"
                      onClick={() => {
                        handleDeleteQuestion(question.id);
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
          <nav className="mt-5 mb-0" aria-label="Page navigation example">
            <ul class="pagination">
              <li
                className={`page-item ${
                  activePage.currentPage === 1 ? "disabled" : ""
                }`}
                onClick={handlePrevious}
              >
                <a className="page-link">
                  <FontAwesomeIcon icon={faAnglesLeft} />
                </a>
              </li>
              {pages.map((page) => (
                <li
                  key={page}
                  className={`page-item ${
                    activePage.currentPage === page ? "active" : ""
                  }`}
                  onClick={() => handlePageClick(page)}
                >
                  <a className="page-link">{page}</a>
                </li>
              ))}
              <li
                className={`page-item ${
                  activePage.currentPage === pages.length ? "disabled" : ""
                }`}
                onClick={handleNext}
              >
                <a className="page-link">
                  <FontAwesomeIcon icon={faAnglesRight} />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};
export default FAQPage;
