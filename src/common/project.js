/**
 * 获得校验规则
 * @param {*} text
 * @param {*} params {required = true, maxLen = 20, select = false, pattern = null, validateLen = true }
 * @examples
 * getNormalRules('手机号, {pattern: 手机正则,validateLen: false }) => [{required: true, message: '请输入手机号'}, {pattern: 手机正则, message: '请输入正确的手机号'}]
 */
export function getNormalRules(text, params = {}) {
  const {
    required = true,
    maxLen = 20,
    select = false,
    pattern = null,
    validateLen = true,
    upload = false,
    idCard = false,
  } = params;
  const rules = [];
  let operate = select ? '请选择' : '请输入';
  if (upload) {
    operate = '请上传';
    rules.push({
      validator: (rule, value) => {
        if (isEmptyArray(value)) {
          return Promise.reject('请上传文件');
        }
        return Promise.resolve();
      },
    });
  }

  if (required && !upload) {
    rules.push({
      required: true,
      message: `${operate}${text}`,
    });
  }
  if (!select && !upload && validateLen) {
    rules.push({
      max: maxLen,
      message: `${operate}不超过${maxLen}个字的${text}`,
    });
  }
  if (pattern) {
    rules.push({
      pattern,
      message: `${operate}正确的${text}`,
    });
  }
  if (idCard) {
    rules.push({
      validator: (_, value) => {
        return checkIdCard(_, value);
      },
    });
  }

  return rules;
}