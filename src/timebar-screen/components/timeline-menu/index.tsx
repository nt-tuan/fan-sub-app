import { Space, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./timeline-menu.module.scss";

const TimelineMenu = () => {
  return (
    <div className={styles.timeline_menu_container}>
      <Space>
        <Button
          onClick={() => {}}
          type="primary"
          icon={<PlusOutlined />}
          size="large"
        >
          Subtitle
        </Button>
        <Button onClick={() => {}} icon={<DeleteOutlined />} size="large" />
      </Space>
    </div>
  );
};

export default TimelineMenu;
