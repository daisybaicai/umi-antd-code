import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Checkbox, Col, Form, Input, InputNumber, Radio, Row, Select } from 'antd';

const FormItemGroup = React.memo(
  ({ gutter = [20, 20], children, ...props }) => {
    const renderItem = (v) => {
      const {
        props: { colProps = {}, label = "", ...extraProps },
        key = "",
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
  }
);

export default FormItemGroup;
