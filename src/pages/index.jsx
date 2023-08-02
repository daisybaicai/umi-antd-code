import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Switch,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { COL_TYPES, FORM_TYPES, PATTERN_TYPE } from "../common/enum";
import { handleApi, handleRequest } from "../utils/api";
import { getParams, getResponse, getTransformArr } from "../utils/data";
import { getLocalStorage, setLocalStorage } from "../utils/utils";

const DictCustomSelect = React.forwardRef(
  (
    {
      data = {},
      value = undefined,
      onChange = () => {},
      placeholder = "请选择",
      ...rest
    },
    ref
  ) => {
    return (
      <Select
        placeholder={placeholder}
        style={{ width: "100%" }}
        ref={ref}
        value={value}
        onChange={onChange}
        {...rest}
      >
        {Object.keys(data).map((k) => (
          <Select.Option key={data[k]?.desc} value={data[k]?.code}>
            {data[k]?.desc}
          </Select.Option>
        ))}
      </Select>
    );
  }
);

function SelectTable({ api = {} }) {
  const [form] = Form.useForm();

  const [type, setType] = useState(null);

  const [options, setOptions] = useState({});

  const handleShow = (record, t) => {
    if (Object.keys(options)?.length <= 0) {
      message.error("请补充options");
      return;
    }

    setType(t);
    if (record.children) {
      return;
    }

    setVisible(true);
    let params = getParams(record);
    const response = getResponse(record);

    // 增加默认formType配置项处理
    if (Array.isArray(params) && params.length > 0) {
      params = params.map((item) => {
        let result = FORM_TYPES.INPUT.code;
        if (item.description?.includes("时间")) {
          result = FORM_TYPES.DATE.code;
        }
        if (item.description?.includes("附件")) {
          result = FORM_TYPES.FILE.code;
        }

        return {
          ...item,
          formType: result,
          isFormItem: true,
          formCol: "8",
        };
      });
    }

    const {
      ignored: { params: pIg = [], response: rIg = [] },
    } = options;

    // 'api', 'params'
    form.setFieldsValue({
      api: {
        description: record.description || "",
        methods: record.method,
        url: record.url,
        params: params?.filter((item) => !pIg.includes(item?.name)) || [],
        response: response?.filter((item) => !rIg.includes(item?.name)) || [],
      },
    });
  };

  const columns = [
    {
      title: "tags",
      dataIndex: "tags",
      width: 300,
      render: (text, record) => {
        if (record.children) {
          return text;
        }
        return record?.description;
      },
    },
    { title: "类型", dataIndex: "method", key: "method", width: 80 },
    { title: "url", dataIndex: "url", key: "url", width: 240 },
    {
      title: "Action",
      render: (_, record) =>
        !record.children ? (
          <Space>
            <a onClick={() => handleShow(record, "list")}>列表</a>
            <a onClick={() => handleShow(record, "form-detail")}>
              详情表单实例
            </a>
            {options?.checkForm && (
              <>
                <a onClick={() => handleShow(record, "form")}>form</a>
                <a onClick={() => handleShow(record, "detail")}>detail</a>
                <a onClick={() => handleShow(record, "dialog")}>弹框提问</a>
              </>
            )}
          </Space>
        ) : null,
      // <a onClick={() => handleShow(record)}>查看</a>,
    },
    // { title: '描述', dataIndex: 'description', key: 'description' },
    // { title: 'id', dataIndex: 'id', render: (text) => text ? text?.slice(0,4) + '...': ''},
  ];

  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [rKeys, setRKeys] = useState([]);

  const [initialObjects, setInitialObjects] = useState({});

  const rowSelection = {
    onChange: (rKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${rKeys}`, "selectedRows: ", selectedRows);
      setSelectedRowKeys(rKeys);
      setRKeys(selectedRows.filter((item) => item.id));
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
    selectedRowKeys,
  };

  const vsSaveFile = (payload) => {
    const msgObj = {
      cmd: "writeFile",
      data: {
        options,
        text: JSON.stringify(payload),
      },
    };
    window.parent.postMessage(msgObj, "*");
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      // async () => {
      const { api: apiInfos = {}, ...rest } = values;
      let res = [];
      if (apiInfos?.response) {
        res = apiInfos?.response;
      }
      apiInfos.response = res;
      const payload = {
        actionType: type,
        ...rest,
        api: apiInfos,
      };
      // 如何通讯给vscode 插件，然后就行了
      // const { data } = await api.callRemote({
      //   type: `org.plugin.template.${type}`,
      //   payload: {
      //     text: JSON.stringify(payload),
      //   },
      // });
      // if (data) {
      //   setVisible(false);
      // }
      // }
      vsSaveFile(payload);
      setVisible(false);
    });
  };

  const setKeys = (key) => {
    if (key === "swagger-data") {
      const res = getLocalStorage("swagger-data");
      if (res) {
        const data = JSON.parse(res);
        if (!data.swagger) {
          message.error("请检查swagger数据是否正确，已自动清空");
          localStorage.removeItem("swagger-data");
          return;
        }
        const dataObj = JSON.parse(res).paths;
        setInitialObjects(dataObj);
        setDataSource(getTransformArr(dataObj));
      }
    }
    if (key === "options-key") {
      const res2 = getLocalStorage("options-key");
      if (res2) {
        setOptions(JSON.parse(res2));
      }
    }
  };

  useEffect(() => {
    setKeys("swagger-data");
    setKeys("options-key");
  }, []);

  const handleChange = (id, key = "swagger-data") => {
    var selectedFile = document.getElementById(id).files[0]; //获取读取的File对象

    try {
      var reader = new FileReader(); //这里是核心！！！读取操作就是由它完成的。
      reader.readAsText(selectedFile); //读取文件的内容

      reader.onload = function () {
        const text = this.result;
        const res = JSON.parse(text);
        // form.setFieldsValue({
        //   publicKey: res.pubKey,
        //   data: res.originalData,
        //   signedData: res.singData,
        // });
        if (key === "options-key") {
          // 保证key是对的.
          if (Object.keys(res).includes("prefixHost")) {
            setLocalStorage([key], JSON.stringify(res));
            message.success(key + "上传成功");
            setKeys(key);
          } else {
            message.error("请上传正确的options");
          }
        } else {
          // 判断是否是swagger
          if (!res.swagger) {
            message.error("请上传正确的swagger文件");
            return;
          }
          setLocalStorage([key], JSON.stringify(res));
          message.success(key + "上传成功");
          setKeys(key);
        }
      };
    } catch (err) {
      console.log("er", err);
    }
  };

  // console.log('getTransformArr(initialObjects)', getTransformArr(initialObjects))

  const handleDownload = () => {
    const obj = {
      prefixHost: "/api",
      prefix: ["/api/v1", "/api"],
      url: "http://10.1.42.180:8090/admin/v2/api-docs?group=%E5%90%8E%E5%8F%B0API%E5%88%86%E7%BB%84",
      ignored: {
        params: ["X-Access-Token", "pageNum", "pageSize"],
        response: ["current", "pages", "size", "total", "count"],
      },
      code: 0,
      data: "data",
      items: "items",
    };
    // encodeURIComponent解决中文乱码。
    var blob = new Blob([JSON.stringify(obj)]);
    const aHtml = document.createElement("a");
    aHtml.download = "options.json"; // 通过修改后缀名伪装成Excel
    aHtml.href = URL.createObjectURL(blob);
    aHtml.click();
  };

  const createApi = () => {
    const msgObj = {
      cmd: "createApi",
      data: {
        options,
        arr: rKeys,
      },
    };
    console.log("e", msgObj);
    window.parent.postMessage(msgObj, "*");
  };

  const createBigScreenApi = () => {
    const msgObj = {
      cmd: "createBigScreenApi",
      data: {
        options,
        arr: rKeys,
      },
    };

    let resultText = ``;

    for (let i = 0; i < rKeys.length; i++) {
      const item = rKeys[i];
      const r = handleApi(item, options, false);
      resultText += r;
    }

    let resultTextR2 = ``;

    for (let i = 0; i < rKeys.length; i++) {
      const item = rKeys[i];
      const r = handleRequest(item, options, false, i);
      resultTextR2 += r;
    }
    console.log("result", resultText);
    console.log("result", resultTextR2);
    // window.parent.postMessage(msgObj, '*')
  };

  const [searchValue, setSearchValue] = useState("");

  const onSearch = () => {
    const arr = getTransformArr(initialObjects);
    let result = [];
    if (!searchValue) {
      result = arr;
    } else {
      result = arr.filter((item) => {
        return item.tags.includes(searchValue);
      });
    }
    setDataSource(result);
  };

  const [dataSource, setDataSource] = useState([]);

  return (
    <>
      <p>
        用法： 1.下载swagger内容，保存为json，上传至swagger-data
        里面的值需要通过后端的接口的类似http://10.1.42.180:8090/admin/v2/api-docs?group=%E5%90%8E%E5%82F%B0API%E5%88%86%E7%BB%84的接口结果
      </p>
      <p>2.上传本地options</p>
      <Button
        onClick={() => {
          const msgObj = {
            cmd: "getUrl",
            data: {
              options
            },
          };
          console.log("getUrl", msgObj);
          window.parent.postMessage(msgObj, "*");
        }}
      >
        生成swagger数据流-测试版本功能
      </Button>
      <br />
      {/* <Button
        onClick={async () => {
          if (!options?.url) {
            alert('暂无匹配url');
            return;
          }
          fetch(options?.url, {
            headers: {
              'access-control-allow-origin': '*',
            },
          })
            .then(response => {
              return response.json(); // 先将结果转换为 JSON 对象
            })
            .then(data => {
              console.log(JSON.stringify(data));
              alert(JSON.stringify(data));
              setLocalStorage('swagger-data', JSON.stringify(data));
            })
            .catch(function (error) {
              api.logger.error(error);
            });
        }}
      >
        生成swagger数据流
      </Button> */}
      <a>上传swagger-data</a>
      <input
        type="file"
        id="files"
        accept="application/json"
        onChange={() => handleChange("files", "swagger-data")}
      ></input>
      ====
      <a>上传options</a>
      <input
        type="file"
        id="files2"
        accept="application/json"
        onChange={() => handleChange("files2", "options-key")}
      ></input>
      <Button onClick={() => handleDownload()}>下载默认options</Button>
      <Button onClick={() => createApi()}>批量生成api request</Button>
      {getLocalStorage("dsy-test") && (
        <Button onClick={() => createBigScreenApi()}>request 大屏用</Button>
      )}
      <Input
        value={searchValue}
        onChange={(v) => setSearchValue(v.target.value)}
        style={{ width: "500px" }}
        placeholder="输入tags，可以过滤"
      />
      <Button onClick={onSearch}>搜素</Button>
      <div>
        <Table
          styles={{ background: "white" }}
          scroll={{ y: "70vh" }}
          columns={columns}
          rowKey={(record) => record.url || record.tags}
          rowSelection={{ ...rowSelection, checkStrictly: false }}
          dataSource={dataSource}
        />
      </div>
      <Modal
        open={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
        width={800}
      >
        <h5>类型：{type}</h5>
        <DndProvider backend={HTML5Backend}>
          <Form form={form}>
            {/* <Form.Item label="model名称" name="modelName">
              <Input />
            </Form.Item> */}
            {/* <Form.Item label="componentsName" name="componentsName">
              <Input />
            </Form.Item> */}
            <Form.Item label="isCreate" name="isCreate" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="componentsPath" name="componentsPath">
              <Input />
            </Form.Item>
            {type === "form-detail" && (
              <Form.Item
                label="是否为proForm"
                name="isProForm"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            )}
            {(type === "dialog" || type === "form") && (
              <Form.Item
                label="loadItem"
                name="loadItem"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            )}
            {type === "dialog" && (
              <>
                <Form.Item label="handleName" name="handleName">
                  <Input />
                </Form.Item>
                <Form.Item label="modalParams" name="modalParams">
                  <Input />
                </Form.Item>
                <Form.Item label="modalForm" name="modalForm">
                  <Input />
                </Form.Item>
                {/* <Form.Item label="弹框类型" name="dialogType">
                  <DictCustomSelect data={DIALOG_TYPE} />
                </Form.Item>
                <Form.Item label="弹框formRef" name="dialogFormRef">
                  <DictCustomSelect data={DIALOG_FORM_REF_TYPE} />
                </Form.Item> */}
              </>
            )}
            <Form.Item label="api相关" name="api">
              <Form.Item label="url" name={["api", "url"]}>
                <Input />
              </Form.Item>
              <Form.Item label="methods" name={["api", "methods"]}>
                <Input />
              </Form.Item>
              <Form.Item label="description" name={["api", "description"]}>
                <Input />
              </Form.Item>
              <Form.Item label="params">
                <Form.List name={["api", "params"]}>
                  {(fields, { add, remove, move }) => (
                    <>
                      {fields.map(
                        ({ key, name, fieldKey, ...restField }, index) => (
                          <Space
                            key={key}
                            style={{ display: "flex", marginBottom: 8 }}
                            align="baseline"
                          >
                            {/* <DraggableItem index={index} moveField={move}> */}
                            <Space
                              key={key}
                              style={{ display: "flex", marginBottom: 8 }}
                              align="baseline"
                            >
                              {/* <DragOutlined /> */}

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
                                  { required: true, message: "description" },
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
                                    { required: true, message: "formType" },
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
                                  name={[name, "isFormItem"]}
                                  fieldKey={[fieldKey, "isFormItem"]}
                                  valuePropName="checked"
                                >
                                  <Switch />
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
                                    { required: true, message: "formCol" },
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
                            {/* </DraggableItem> */}
                          </Space>
                        )
                      )}
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block>
                          Add field
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>
              <Form.Item label="response">
                <Form.List name={["api", "response"]}>
                  {(fields, { add, remove, move }) => (
                    <>
                      {fields?.map(
                        ({ key, name, fieldKey, ...restField }, index) => (
                          <Space
                            key={key}
                            style={{ display: "flex", marginBottom: 8 }}
                            align="baseline"
                          >
                            {/* <DraggableItem index={index} moveField={move}> */}
                            <Space
                              key={key}
                              style={{ display: "flex", marginBottom: 8 }}
                              align="baseline"
                            >
                              {/* <DragOutlined /> */}
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
                                  { required: true, message: "description" },
                                ]}
                              >
                                <Input placeholder="description" />
                              </Form.Item>
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
                            {/* </DraggableItem> */}
                          </Space>
                        )
                      )}
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block>
                          Add field
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </Form.Item>
          </Form>
        </DndProvider>
      </Modal>
    </>
  );
}

export default SelectTable;