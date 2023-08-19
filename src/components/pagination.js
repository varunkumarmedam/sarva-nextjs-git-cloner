const Pagination = ({ steppers, activePage, onBtnClk }) => {
  const paginationButtons = [];
  console.log(activePage);
  for (let i = 0; i < steppers / 6; i++) {
    paginationButtons.push(
      <button
        type="button"
        onClick={() => onBtnClk(i)}
        className={`border p-5 ${
          i == activePage ? "bg-white text-black" : "border-blue-300"
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
