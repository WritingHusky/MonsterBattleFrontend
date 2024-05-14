const ErrorPage = ({ page: page }: { page: String }) => {
  return (
    <div>
      ErrorPage Something went wrong<br></br>
      <p>Tried to go to page: {page}</p>
    </div>
  );
};

export default ErrorPage;
