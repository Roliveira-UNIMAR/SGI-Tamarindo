import { User } from "@/types/user";
import { Badge, Descriptions, Modal } from "antd";

const getStatus = (id: number) => {
  switch (id) {
    case 1:
      return <Badge status="success" text="Activo" />;
    case 2:
      return <Badge status="default" text="Inactivo" />;
  }
};

const userItems = (user: User) => [
  {
    key: "1",
    label: "Cédula",
    children: user.document,
  },
  {
    key: "2",
    label: "Nombre y Apellido",
    children: user.full_name,
  },
  {
    key: "3",
    label: "Teléfono",
    children: user.phone,
  },
  {
    key: "4",
    label: "Email",
    children: user.email,
  },
  {
    key: "5",
    label: "Dirección",
    children: user.address,
  },
  {
    key: "6",
    label: "Status",
    children: getStatus(user.status_id),
  },
];

const UserDetail = ({
  record,
  isModalOpen,
  closeModal,
}: {
  record: User;
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  return (
    <Modal
      title="Detalles del Usuario"
      centered
      open={isModalOpen}
      onCancel={closeModal} // Cierra el modal correctamente
      destroyOnClose
      width={{
        xs: "90%",
        sm: "80%",
        md: "70%",
        lg: "60%",
        xl: "50%",
        xxl: "40%",
      }}
      footer={null}
    >
      <Descriptions
        bordered
        column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
        items={userItems(record)}
      />
    </Modal>
  );
};

export default UserDetail;
