const Pagination = ({ steppers, activePage, onBtnClk }) => {
  const paginationButtons = [];
  console.log(activePage);
  for (let i = 0; i < steppers / 6; i++) {
    paginationButtons.push(
      <button
        type="button"
        onClick={() => onBtnClk(i)}
        className={`border p-3 ${
          i == activePage
            ? "bg-gray-500 text-white shadow-md shadow-gray-400"
            : "border-white-100"
        }`}
        key={i}
      >
        {i + 1}
      </button>
    );
  }
  return <div>{paginationButtons}</div>;
};
export default Pagination;
