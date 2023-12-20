import React from 'react';
import { Col, Row } from 'antd';

const FormItemGroup = React.memo(({ gutter = [20, 20], children, ...props }) => {
  const renderItem = (v) => {
    if (!v?.props) {
      return null;
    }

    const {
      props: { colProps = {}, label = '', ...extraProps },
      key = '',
      ...extraEleProps
    } = v;
    const child = {
      ...extraEleProps,
      key,
      props: {
        label,
        ...extraProps,
      },
    };
    return (
      <Col {...colProps} key={key || label}>
        {child}
      </Col>
    );
  };
  return (
    <Row gutter={gutter} {...props}>
      {children instanceof Array ? (
        <>{children.map((v, index) => renderItem(v))}</>
      ) : (
        renderItem(children)
      )}
    </Row>
  );
});
export default FormItemGroup;
