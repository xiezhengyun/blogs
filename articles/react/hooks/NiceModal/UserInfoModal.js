import { useCallback } from "react";
import { Form } from "antd";
import FormBuilder from "antd-form-builder";
import NiceModal, { createNiceModal, useNiceModal } from "./NiceModal";

export default createNiceModal("user-info-modal", ({ user }) => {
  const [form] = Form.useForm();
  const meta = {
    initialValues: user,
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "job", label: "Job Title", required: true },
    ],
  };
  const modal = useNiceModal("user-info-modal");

  const handleSubmit = useCallback(() => {
    form.validateFields().then(() => {
      modal.resolve({ ...user, ...form.getFieldsValue() });
      modal.hide();
    });
  }, [modal, user, form]);
  return (
    <NiceModal
      id="user-info-modal"
      title={user ? "Edit User" : "New User"}
      okText={user ? "Update" : "Create"}
      onOk={handleSubmit}
    >
      <Form form={form}>
        <FormBuilder meta={meta} form={form} />
      </Form>
    </NiceModal>
  );
});
