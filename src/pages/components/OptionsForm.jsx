import React, { forwardRef, useEffect, useImperativeHandle } from "react";

import { Button, Card, Form, Input, Space } from "antd";

import { getNormalRules } from "@/common/project";
import FormItemGroup from "@/components/FormItemGroup";
import { MinusCircleOutlined } from "@ant-design/icons";

const FORM_LAYOUT = {
  sm: 12,
  md: 12,
  xl: 12,
};

const OptionsForm = React.memo(
  forwardRef(({ readonly = false, value = {}, form }, ref) => {
    // const [form] = Form.useForm();
    const handleSubmit = (cb = () => {}) => {
      form.validateFields().then((values) => {
        cb(values);
      });
    };
    useImperativeHandle(ref, () => {
      return {
        submit: handleSubmit,
        getFieldsValue: form.getFieldsValue,
        setFieldsValue: form.setFieldsValue,
        scrollToField: form.scrollToField,
      };
    });

    useEffect(() => {
      if (value && form && typeof form.setFieldsValue === "function") {
        form.setFieldsValue({
          ...value,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
      <Form
        name="base-form"
        form={form}
        onValuesChange={(_, values) => {
          console.log(values);
        }}
        layout="horizontal"
        initialValues={value}
        requiredMark={!readonly}
      >
        <Card title="基本表单">
          <FormItemGroup>
            <Form.Item
              name="prefixHost"
              label="前缀"
              colProps={FORM_LAYOUT}
              rules={getNormalRules("前缀", {})}
              validateFirst
            >
              <Input placeholder="请输入" />
            </Form.Item>

            {/* <Form.Item
              name="prefix"
              label="前缀文本"
              colProps={FORM_LAYOUT}
              rules={getNormalRules("前缀文本", {})}
              validateFirst
            >
              <Input placeholder="请输入" />
            </Form.Item> */}

            <Form.Item label="prefix">
              <Form.List name="prefix">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Space key={key}>
                        <Form.Item
                          {...restField}
                          label="prefix Param"
                          name={name}
                          fieldKey={fieldKey}
                        >
                          <Input />
                        </Form.Item>
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          onClick={() => remove(name)}
                        />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()}>
                        Add prefix
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>

            <Form.Item
              name="username"
              label="账号"
              colProps={FORM_LAYOUT}
              rules={getNormalRules("账号", {})}
              validateFirst
            >
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              colProps={FORM_LAYOUT}
              rules={getNormalRules("密码", {})}
              validateFirst
            >
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item
              name="url"
              label="swagger配置api"
              colProps={FORM_LAYOUT}
              rules={getNormalRules("swagger配置api", {
                maxLen: 300
              })}
              validateFirst
            >
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item name="ignored" label="忽略参数">
              <Form.List name={["ignored", "params"]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Space key={key}>
                        <Form.Item
                          {...restField}
                          key={key}
                          label="Ignored Param"
                          name={name}
                          fieldKey={fieldKey}
                        >
                          <Input />
                        </Form.Item>
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          onClick={() => remove(name)}
                        />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()}>
                        Add Ignored Param
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <Form.List name={["ignored", "response"]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Space key={key}>
                        <Form.Item
                          {...restField}
                          key={key}
                          label="Ignored response"
                          name={name}
                          fieldKey={fieldKey}
                        >
                          <Input />
                        </Form.Item>
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          onClick={() => remove(name)}
                        />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()}>
                        Add Ignored Response Field
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>

            <Form.Item
              name="code"
              label="code值"
              colProps={FORM_LAYOUT}
              rules={getNormalRules("code值", {
                validateLen: false
              })}
              validateFirst
            >
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item
              name="data"
              label="data值"
              colProps={FORM_LAYOUT}
              rules={getNormalRules("data值", {})}
              validateFirst
            >
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item
              name="items"
              label="items值"
              colProps={FORM_LAYOUT}
              rules={getNormalRules("items值", {})}
              validateFirst
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </FormItemGroup>
        </Card>
      </Form>
    );
  })
);

export default OptionsForm;
