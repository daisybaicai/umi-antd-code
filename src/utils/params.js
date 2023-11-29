// Assuming you have the following imports and constants
import { FORM_TYPES } from "../common/enum";

const processFormType = (description) => {
  if (description?.includes("时间")) {
    return FORM_TYPES.DATE.code;
  }
  if (description?.includes("附件")) {
    return FORM_TYPES.FILE.code;
  }
  return FORM_TYPES.INPUT.code;
};

/**
 * 增加默认params参数 cols，formType，isFormItem，formCol
 * @param {*} params 
 * @returns 
 */
export const addParamsDefault = (params) => {
  // Inside your component or function
  if (!Array.isArray(params)) {
    return [];
  }
  return params?.map((item) => {
    const formType = processFormType(item?.description);
    const children = item?.children || [];
    const processedChildren = children?.map((child) => ({
      ...child,
      formType: processFormType(child?.description),
      isFormItem: true,
      formCol: "8",
    }));

    return {
      ...item,
      formType,
      isFormItem: true,
      formCol: "8",
      children: processedChildren,
    };
  });
};
