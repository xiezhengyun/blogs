import { useMemo } from "react";
import { Button } from "antd";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { modalReducer, useNiceModal } from "./NiceModal";
import UserInfoModal from "./UserInfoModal";
import UserList from "./UserList";

// redux store
const store = createStore(modalReducer);

function UsersLayout() {
  const modal = useNiceModal("user-info-modal");

  return (
    <div className="exp-14-users">
      <sider>
        <Button type="primary" onClick={() => modal.show()}>
          + New User
        </Button>
      </sider>
      <section>
        <UserList />
      </section>
      <UserInfoModal />
    </div>
  );
}

export default () => {
  return (
    <Provider store={store}>
      <UsersLayout />
    </Provider>
  );
};
