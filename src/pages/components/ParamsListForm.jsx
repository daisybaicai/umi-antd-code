import { Button, Collapse, Divider, Form, Input, Select, Space } from "antd";
import React from "react";
import { COL_TYPES, FORM_TYPES, PATTERN_TYPE } from "../../common/enum";
import DictCustomSelect from '../../components/DictCustomSelect';


function ParamsListForm({ type = "", form }) {
  return (
    <Collapse defaultActiveKey={["1"]} key="params">
      <Collapse.Panel header="params" key="1">
        <Form.List name={["params"]}>
          {(fields, { add, remove, move }) => {
            return (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }, index) => {
                  const hasChildren =
                    form.getFieldValue(["params", index, "children"])?.length >
                    0;
                  if (hasChildren) {
                    return null;
                  }

                  return (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "name"]}
                          fieldKey={[fieldKey, "name"]}
                          rules={[{ required: true, message: "name" }]}
                        >
                          <Input placeholder="name" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "description"]}
                          fieldKey={[fieldKey, "description"]}
                          rules={[
                            {
                              required: true,
                              message: "description",
                            },
                          ]}
                        >
                          <Input placeholder="description" />
                        </Form.Item>
                        {(type === "dialog" ||
                          type === "form" ||
                          type === "form-detail") && (
                          <Form.Item
                            {...restField}
                            name={[name, "formType"]}
                            fieldKey={[fieldKey, "formType"]}
                            rules={[
                              {
                                required: true,
                                message: "formType",
                              },
                            ]}
                          >
                            <DictCustomSelect data={FORM_TYPES} />
                          </Form.Item>
                        )}
                        {(type === "dialog" ||
                          type === "form" ||
                          type === "form-detail") && (
                          <Form.Item
                            {...restField}
                            name={[name, "formPattern"]}
                            fieldKey={[fieldKey, "formPattern"]}
                            rules={[
                              {
                                required: false,
                                message: "表单的正则",
                              },
                            ]}
                          >
                            <DictCustomSelect
                              data={PATTERN_TYPE}
                              allowClear
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                (option?.label ?? "").includes(input)
                              }
                              placeholder="正则非必填"
                              filterSort={(optionA, optionB) =>
                                (optionA?.label ?? "")
                                  .toLowerCase()
                                  .localeCompare(
                                    (optionB?.label ?? "").toLowerCase()
                                  )
                              }
                            />
                          </Form.Item>
                        )}
                        {(type === "dialog" ||
                          type === "form" ||
                          type === "form-detail") && (
                          <Form.Item
                            {...restField}
                            name={[name, "formCol"]}
                            fieldKey={[fieldKey, "formCol"]}
                            rules={[
                              {
                                required: true,
                                message: "formCol",
                              },
                            ]}
                          >
                            <DictCustomSelect data={COL_TYPES} />
                          </Form.Item>
                        )}
                        <span onClick={() => remove(name)}>X</span>
                        <span
                          onClick={() => move(index, index - 1)}
                          style={{ cursor: "pointer" }}
                        >
                          ↑
                        </span>
                        <span
                          onClick={() => move(index, index + 1)}
                          style={{ cursor: "pointer" }}
                        >
                          ↓
                        </span>
                      </Space>
                    </Space>
                  );
                })}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Add field
                  </Button>
                </Form.Item>

                {fields.map(({ key: paramKey, name: paramName }, index) => {
                  const hasChildren =
                    form.getFieldValue(["params", index, "children"])?.length >
                    0;
                  const paramPath = ["params", index];
                  if (hasChildren) {
                    return (
                      <>
                        list相关字段
                        <Form.Item name={[paramName, "name"]} label="name">
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name={[paramName, "description"]}
                          label="描述"
                        >
                          <Input />
                        </Form.Item>
                        <Collapse defaultActiveKey={["1"]} key={paramKey}>
                          <Collapse.Panel
                            header={form.getFieldValue([...paramPath, "name"])}
                            key="1"
                          >
                            <Form.List name={[paramName, "children"]}>
                              {(
                                childFields,
                                {
                                  add: addChild,
                                  remove: removeChild,
                                  move: moveChild,
                                }
                              ) => (
                                <>
                                  {childFields.map(
                                    (
                                      {
                                        key: childKey,
                                        name: childName,
                                        fieldKey: childFieldKey,
                                        ...restChildField
                                      },
                                      childIndex
                                    ) => (
                                      <Space
                                        key={childKey}
                                        style={{
                                          display: "flex",
                                          marginBottom: 8,
                                        }}
                                        align="baseline"
                                      >
                                        <Space
                                          key={childKey}
                                          style={{
                                            display: "flex",
                                            marginBottom: 8,
                                          }}
                                          align="baseline"
                                        >
                                          <Form.Item
                                            {...restChildField}
                                            name={[childName, "name"]}
                                            fieldKey={[childFieldKey, "name"]}
                                            rules={[
                                              {
                                                required: true,
                                                message: "name",
                                              },
                                            ]}
                                          >
                                            <Input placeholder="name" />
                                          </Form.Item>
                                          <Form.Item
                                            {...restChildField}
                                            name={[childName, "description"]}
                                            fieldKey={[
                                              childFieldKey,
                                              "description",
                                            ]}
                                            rules={[
                                              {
                                                required: true,
                                                message: "description",
                                              },
                                            ]}
                                          >
                                            <Input placeholder="description" />
                                          </Form.Item>
                                          {(type === "dialog" ||
                                            type === "form" ||
                                            type === "form-detail") && (
                                            <Form.Item
                                              {...restChildField}
                                              name={[childName, "formType"]}
                                              fieldKey={[
                                                childFieldKey,
                                                "formType",
                                              ]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "formType",
                                                },
                                              ]}
                                            >
                                              <DictCustomSelect
                                                data={FORM_TYPES}
                                              />
                                            </Form.Item>
                                          )}
                                          {(type === "dialog" ||
                                            type === "form" ||
                                            type === "form-detail") && (
                                            <Form.Item
                                              {...restChildField}
                                              name={[childName, "formPattern"]}
                                              fieldKey={[
                                                childFieldKey,
                                                "formPattern",
                                              ]}
                                              rules={[
                                                {
                                                  required: false,
                                                  message: "表单的正则",
                                                },
                                              ]}
                                            >
                                              <DictCustomSelect
                                                data={PATTERN_TYPE}
                                                allowClear
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                  (
                                                    option?.label ?? ""
                                                  ).includes(input)
                                                }
                                                placeholder="正则非必填"
                                                filterSort={(
                                                  optionA,
                                                  optionB
                                                ) =>
                                                  (optionA?.label ?? "")
                                                    .toLowerCase()
                                                    .localeCompare(
                                                      (
                                                        optionB?.label ?? ""
                                                      ).toLowerCase()
                                                    )
                                                }
                                              />
                                            </Form.Item>
                                          )}
                                          {(type === "dialog" ||
                                            type === "form" ||
                                            type === "form-detail") && (
                                            <Form.Item
                                              {...restChildField}
                                              name={[childName, "formCol"]}
                                              fieldKey={[
                                                childFieldKey,
                                                "formCol",
                                              ]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "formCol",
                                                },
                                              ]}
                                            >
                                              <DictCustomSelect
                                                data={COL_TYPES}
                                              />
                                            </Form.Item>
                                          )}
                                          <span
                                            onClick={() =>
                                              removeChild(childName)
                                            }
                                          >
                                            X
                                          </span>
                                          <span
                                            onClick={() =>
                                              moveChild(
                                                childIndex,
                                                childIndex - 1
                                              )
                                            }
                                            style={{
                                              cursor: "pointer",
                                            }}
                                          >
                                            ↑
                                          </span>
                                          <span
                                            onClick={() =>
                                              moveChild(
                                                childIndex,
                                                childIndex + 1
                                              )
                                            }
                                            style={{
                                              cursor: "pointer",
                                            }}
                                          >
                                            ↓
                                          </span>
                                        </Space>
                                      </Space>
                                    )
                                  )}
                                  <Form.Item>
                                    <Button
                                      type="dashed"
                                      onClick={() => addChild()}
                                      block
                                    >
                                      Add child field
                                    </Button>
                                  </Form.Item>
                                </>
                              )}
                            </Form.List>
                          </Collapse.Panel>
                        </Collapse>
                        <Divider />
                      </>
                    );
                  } else {
                    return null;
                  }
                })}
              </>
            );
          }}
        </Form.List>
      </Collapse.Panel>
    </Collapse>
  );

  return (
    <>
      {/* <Form
        form={form}
      > */}
      <Form.Item label="api相关">
        <Form.List name={["params"]}>
          {(fields, { add, remove, move }) => {
            return (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }, index) => {
                  const hasChildren =
                    form.getFieldValue(["params", index, "children"])?.length >
                    0;
                  if (hasChildren) {
                    return null;
                  }

                  return (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "name"]}
                          fieldKey={[fieldKey, "name"]}
                          rules={[{ required: true, message: "name" }]}
                        >
                          <Input placeholder="name" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "description"]}
                          fieldKey={[fieldKey, "description"]}
                          rules={[
                            {
                              required: true,
                              message: "description",
                            },
                          ]}
                        >
                          <Input placeholder="description" />
                        </Form.Item>
                        {(type === "dialog" ||
                          type === "form" ||
                          type === "form-detail") && (
                          <Form.Item
                            {...restField}
                            name={[name, "formType"]}
                            fieldKey={[fieldKey, "formType"]}
                            rules={[
                              {
                                required: true,
                                message: "formType",
                              },
                            ]}
                          >
                            <DictCustomSelect data={FORM_TYPES} />
                          </Form.Item>
                        )}
                        {(type === "dialog" ||
                          type === "form" ||
                          type === "form-detail") && (
                          <Form.Item
                            {...restField}
                            name={[name, "formPattern"]}
                            fieldKey={[fieldKey, "formPattern"]}
                            rules={[
                              {
                                required: false,
                                message: "表单的正则",
                              },
                            ]}
                          >
                            <DictCustomSelect
                              data={PATTERN_TYPE}
                              allowClear
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                (option?.label ?? "").includes(input)
                              }
                              placeholder="正则非必填"
                              filterSort={(optionA, optionB) =>
                                (optionA?.label ?? "")
                                  .toLowerCase()
                                  .localeCompare(
                                    (optionB?.label ?? "").toLowerCase()
                                  )
                              }
                            />
                          </Form.Item>
                        )}
                        {(type === "dialog" ||
                          type === "form" ||
                          type === "form-detail") && (
                          <Form.Item
                            {...restField}
                            name={[name, "formCol"]}
                            fieldKey={[fieldKey, "formCol"]}
                            rules={[
                              {
                                required: true,
                                message: "formCol",
                              },
                            ]}
                          >
                            <DictCustomSelect data={COL_TYPES} />
                          </Form.Item>
                        )}
                        <span onClick={() => remove(name)}>X</span>
                        <span
                          onClick={() => move(index, index - 1)}
                          style={{ cursor: "pointer" }}
                        >
                          ↑
                        </span>
                        <span
                          onClick={() => move(index, index + 1)}
                          style={{ cursor: "pointer" }}
                        >
                          ↓
                        </span>
                      </Space>
                    </Space>
                  );
                })}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Add field
                  </Button>
                </Form.Item>

                {/* 嵌套 Form.List */}
                {fields.map(({ key: paramKey, name: paramName }, index) => {
                  const hasChildren =
                    form.getFieldValue(["params", index, "children"])?.length >
                    0;
                  const paramPath = ["params", index];
                  if (hasChildren) {
                    return (
                      <>
                        paramname相关字段
                        <Form.Item name={[paramName, "name"]} label="name">
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name={[paramName, "description"]}
                          label="描述"
                        >
                          <Input />
                        </Form.Item>
                        <Collapse defaultActiveKey={["1"]} key={paramKey}>
                          <Collapse.Panel header="嵌套List" key="1">
                            <Form.List name={[paramName, "children"]}>
                              {(
                                childFields,
                                {
                                  add: addChild,
                                  remove: removeChild,
                                  move: moveChild,
                                }
                              ) => (
                                <>
                                  {childFields.map(
                                    (
                                      {
                                        key: childKey,
                                        name: childName,
                                        fieldKey: childFieldKey,
                                        ...restChildField
                                      },
                                      childIndex
                                    ) => (
                                      <Space
                                        key={childKey}
                                        style={{
                                          display: "flex",
                                          marginBottom: 8,
                                        }}
                                        align="baseline"
                                      >
                                        <Space
                                          key={childKey}
                                          style={{
                                            display: "flex",
                                            marginBottom: 8,
                                          }}
                                          align="baseline"
                                        >
                                          <Form.Item
                                            {...restChildField}
                                            name={[childName, "name"]}
                                            fieldKey={[childFieldKey, "name"]}
                                            rules={[
                                              {
                                                required: true,
                                                message: "name",
                                              },
                                            ]}
                                          >
                                            <Input placeholder="name" />
                                          </Form.Item>
                                          <Form.Item
                                            {...restChildField}
                                            name={[childName, "description"]}
                                            fieldKey={[
                                              childFieldKey,
                                              "description",
                                            ]}
                                            rules={[
                                              {
                                                required: true,
                                                message: "description",
                                              },
                                            ]}
                                          >
                                            <Input placeholder="description" />
                                          </Form.Item>
                                          {(type === "dialog" ||
                                            type === "form" ||
                                            type === "form-detail") && (
                                            <Form.Item
                                              {...restChildField}
                                              name={[childName, "formType"]}
                                              fieldKey={[
                                                childFieldKey,
                                                "formType",
                                              ]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "formType",
                                                },
                                              ]}
                                            >
                                              <DictCustomSelect
                                                data={FORM_TYPES}
                                              />
                                            </Form.Item>
                                          )}
                                          {(type === "dialog" ||
                                            type === "form" ||
                                            type === "form-detail") && (
                                            <Form.Item
                                              {...restChildField}
                                              name={[childName, "formPattern"]}
                                              fieldKey={[
                                                childFieldKey,
                                                "formPattern",
                                              ]}
                                              rules={[
                                                {
                                                  required: false,
                                                  message: "表单的正则",
                                                },
                                              ]}
                                            >
                                              <DictCustomSelect
                                                data={PATTERN_TYPE}
                                                allowClear
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                  (
                                                    option?.label ?? ""
                                                  ).includes(input)
                                                }
                                                placeholder="正则非必填"
                                                filterSort={(
                                                  optionA,
                                                  optionB
                                                ) =>
                                                  (optionA?.label ?? "")
                                                    .toLowerCase()
                                                    .localeCompare(
                                                      (
                                                        optionB?.label ?? ""
                                                      ).toLowerCase()
                                                    )
                                                }
                                              />
                                            </Form.Item>
                                          )}
                                          {(type === "dialog" ||
                                            type === "form" ||
                                            type === "form-detail") && (
                                            <Form.Item
                                              {...restChildField}
                                              name={[childName, "formCol"]}
                                              fieldKey={[
                                                childFieldKey,
                                                "formCol",
                                              ]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "formCol",
                                                },
                                              ]}
                                            >
                                              <DictCustomSelect
                                                data={COL_TYPES}
                                              />
                                            </Form.Item>
                                          )}
                                          <span
                                            onClick={() =>
                                              removeChild(childName)
                                            }
                                          >
                                            X
                                          </span>
                                          <span
                                            onClick={() =>
                                              moveChild(
                                                childIndex,
                                                childIndex - 1
                                              )
                                            }
                                            style={{
                                              cursor: "pointer",
                                            }}
                                          >
                                            ↑
                                          </span>
                                          <span
                                            onClick={() =>
                                              moveChild(
                                                childIndex,
                                                childIndex + 1
                                              )
                                            }
                                            style={{
                                              cursor: "pointer",
                                            }}
                                          >
                                            ↓
                                          </span>
                                        </Space>
                                      </Space>
                                    )
                                  )}
                                  <Form.Item>
                                    <Button
                                      type="dashed"
                                      onClick={() => addChild()}
                                      block
                                    >
                                      Add child field
                                    </Button>
                                  </Form.Item>
                                </>
                              )}
                            </Form.List>
                          </Collapse.Panel>
                        </Collapse>
                        <Divider />
                      </>
                    );
                  } else {
                    return null;
                  }
                })}
              </>
            );
          }}
        </Form.List>
      </Form.Item>
      {/* </Form> */}
    </>
  );
}

export default React.memo(ParamsListForm);
