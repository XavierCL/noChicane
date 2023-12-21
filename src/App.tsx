const App = () => {
  return (
    <div>
      <AddNewTransaction />
      <div>
        <TransactionsByDate />
        <TransactionsByAddedDate />
      </div>
    </div>
  );
};

export default App;
