import { Col, Row } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import LeftPanel from "./Left";

const DraggableForm = () => {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Row>
          <Col span={8}>
            <LeftPanel />
          </Col>
          <Col span={8}>中间</Col>
          <Col span={8}>右侧</Col>
        </Row>
      </DndProvider>
    </>
  );
};

export default DraggableForm;
