/**
 * 存储localStorage
 */
export const setLocalStorage = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getLocalStorage = name => {
  if (!name) return;
  return localStorage.getItem(name);
};

/**
 * 删除localStorage
 */
export const removeLocalStorage = name => {
  if (!name) return;
  localStorage.removeItem(name);
};


const titleLower = str => {
  const newStr = str.slice(0, 1).toLowerCase() + str.slice(1);
  return newStr;
};

export function urlTransform(url, prefix = '/api') {
  // const nameArr = url.split(prefix);
  // const nameStr = nameArr.length > 1 ? nameArr[1]: nameArr[0];
  let nameStr = url;
  // 处理前缀
  if (Array.isArray(prefix)) {
    prefix.forEach(pKey => {
      nameStr = nameStr.replace(new RegExp(pKey, 'i'), '');
    });
  } else {
    nameStr = nameStr.replace(new RegExp(prefix, 'i'), '');
  }

  const urlSlice = nameStr.replace(/\/$/, '').replace(/\/\:\w+$/, '');

  // 去除最后可能是{id}形式的文字
  const resultSlice = urlSlice.replace(/{(\w+)}/, '');
  // 去除最后可能是/结尾
  const resultEnd = resultSlice.replace(/\/$/, '');
  return toHump(resultEnd);
}

export function sliceApiUrl(url, prefix = '/api') {
  let result = '';
  // 处理前缀
  if (Array.isArray(prefix)) {
    prefix.forEach(pKey => {
      result = url.replace(new RegExp(pKey, 'i'), '');
    });
  } else {
    result = url.replace(new RegExp(prefix, 'i'), '');
  }

  // 处理最后可能是{id}形式的文字
  const result2 = result.replace(/{(\w+)}/, (_, r) => {
    return `\${params?.${r}}`;
  });
  return result2;
}

export function createStateName(url, suffix = 'List') {
  return titleLower(url.replace(new RegExp(suffix, 'i'), '') + suffix);
}

/**
 * 驼峰转化
 * @param {*} name
 */
export function toHump(name) {
  return name.replace(/\/(\w)/g, function(all, letter) {
    return letter.toUpperCase();
  });
}


export function getLastStr(path) {
  var urlStr = path;
  var index = urlStr.lastIndexOf('/');
  urlStr = urlStr.substring(index + 1, urlStr.length);
  return urlStr;
}

/**
 * 转化columns
 * @param {*} properties
 */
export function getColumns(properties = {}) {
  const columns = [];
  Object.keys(properties).map(key => {
    columns.push({
      title: properties[key].description,
      dataIndex: key,
    });
  });
  return JSON.stringify(columns);
}

/**
 * 转化columns
 * @param {*} properties
 */
export function getColumnsNew(properties = []) {
  const columns = [];
  Array.isArray(properties) &&
    properties.map(key => {
      columns.push({
        title: key?.description,
        dataIndex: key?.name,
      });
    });
  return JSON.stringify(columns);
}
