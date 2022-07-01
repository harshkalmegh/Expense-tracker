import React from "react";
import db from "../Utils/firebase";
import "devextreme/dist/css/dx.material.orange.dark.css";
import DataGrid, {
  SearchPanel,
  Paging,
  Column,
  Button,
} from "devextreme-react/data-grid";

function Datagrid() {
  const [transactionList, setTransactionList] = React.useState([]);

  React.useEffect(() => {
    const transactionRef = db.database().ref("Transaction");
    transactionRef.on("value", (snapshot) => {
      const transactions = snapshot.val();
      const list = [];
      for (let id in transactions) {
        list.push({ id, ...transactions[id] });
      }
      setTransactionList(list);
    });
  }, []);
  return (
    <DataGrid dataSource={transactionList}>
      <Column dataField="id" visible={false} />
      <Column dataField="type" visible={true} />
      <Column dataField="source" visible={true} />
      <Column dataField="date" visible={true} />
      <Column dataField="amount" visible={true} />
      <Column type="buttons" dataField="delete">
        <Button
          name="delete"
          visible={true}
          onClick={(e) => {
            const transactionRef = db
              .database()
              .ref("Transaction")
              .child(e.row.data.id);
            transactionRef.remove();
          }}
        />
      </Column>
      <SearchPanel visible={true} />
      <Paging defaultPageSize={6} />
    </DataGrid>
  );
}

export default Datagrid;
