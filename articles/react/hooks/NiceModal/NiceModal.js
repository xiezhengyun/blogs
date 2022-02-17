import { useCallback, useMemo, useRef } from "react";
import { Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";

// 使用一个 object 缓存 promise 的 resolve 回调函数
const modalCallbacks = {};
export const modalReducer = (state = { hiding: {} }, action) => {
  switch (action.type) {
    case "nice-modal/show":
      return {
        ...state,
        [action.payload.modalId]: action.payload.args || true,
        hiding: {
          ...state.hiding,
          [action.payload.modalId]: false,
        },
      };
    case "nice-modal/hide":
      return action.payload.force
        ? {
            ...state,
            [action.payload.modalId]: false,
            hiding: { [action.payload.modalId]: false },
          }
        : { ...state, hiding: { [action.payload.modalId]: true } };
    default:
      return state;
  }
};

// action creators
function showModal(modalId, args) {
  return {
    type: "nice-modal/show",
    payload: {
      modalId,
      args,
    },
  };
}

function hideModal(modalId, force) {
  return {
    type: "nice-modal/hide",
    payload: {
      modalId,
      force,
    },
  };
}

export const useNiceModal = (modalId) => {
  const dispatch = useDispatch();
  const show = useCallback(
    (args) => {
      return new Promise((resolve) => {
        // 显示对话框时，返回 promise 并且将 resolve 方法临时存起来
        modalCallbacks[modalId] = resolve;
        dispatch(showModal(modalId, args));
      });
    },
    [dispatch, modalId],
  );
  const resolve = useCallback(
    (args) => {
      if (modalCallbacks[modalId]) {
        // 如果存在 resolve 回调函数，那么就调用
        modalCallbacks[modalId](args);
        // 确保只能 resolve 一次
        delete modalCallbacks[modalId];
      }
    },
    [modalId],
  );

  const hide = useCallback(
    (force) => {
      dispatch(hideModal(modalId, force));
      delete modalCallbacks[modalId];
    },
    [dispatch, modalId],
  );

  const args = useSelector((s) => s[modalId]);
  const hiding = useSelector((s) => s.hiding[modalId]);

  return useMemo(
    () => ({ args, hiding, visible: !!args, show, hide, resolve }),
    [args, hide, show, resolve, hiding],
  );
};

function NiceModal({ id, children, ...rest }) {
  const modal = useNiceModal(id);
  return (
    <Modal
      onCancel={() => modal.hide()}
      onOk={() => modal.hide()}
      afterClose={() => modal.hide(true)}
      visible={!modal.hiding}
      {...rest}
    >
      {children}
    </Modal>
  );
}

export const createNiceModal = (modalId, Comp) => {
  return (props) => {
    const { visible, args } = useNiceModal(modalId);
    if (!visible) return null;
    return <Comp {...args} {...props} />;
  };
};

NiceModal.create = createNiceModal;
NiceModal.useModal = useNiceModal;

export default NiceModal;
