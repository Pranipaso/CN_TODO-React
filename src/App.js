import React from "react";
import Todo from "./Components/TodoList/TodoList";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <>
      <div style={styles.dropContainer}>
        <Todo />
      </div>
    </>
  );
};

export default App;

// app styles
const styles = {
  dropContainer: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgrey",
  },
};
