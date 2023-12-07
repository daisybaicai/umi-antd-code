import { getLocalStorage } from '../utils/utils';

export const getTransformArr = obj => {
  const tags = new Set();
  const data = [];
  Object.keys(obj).forEach(path => {
    const pathObj = obj[path];
    const methods = Object.keys(pathObj);
    methods.forEach(method => {
      const methodsObject = pathObj[method];
      // console.log("🚀 ~ file: data.js:11 ~ Object.keys ~ methodsObject:", methodsObject)
      const parametersArr = methodsObject?.parameters?.map(item => {
        return {
          description: item?.name,
          type: item?.schema?.type,
          ...item,
        }
      }) || [];
      // 可能是包含requestBody的情况
      let moreRequestBody = [];
      const schema = methodsObject?.requestBody?.content?.['application/json']?.schema;
      if(schema) {
        const { paths = {}, definitions = {} } = getSwaggerInfos();
        const result = getSchema(schema, definitions);
        // console.log("🚀 ~ file: data.js:25 ~ Object.keys ~ result:", result)
        moreRequestBody = result.map(item => {
          return {
            ...item,
            in: 'body'
          }
        })
      }
      const all = parametersArr.concat(moreRequestBody);


      data.push({
        url: path,
        method,
        description: methodsObject.summary || '',
        tags: methodsObject.tags.join(''),
        id: methodsObject.operationId,
        methods: method,
        params: parametersArr?.concat(moreRequestBody) || [],
      });
      tags.add(methodsObject.tags.join(''));
    });
  });
  // const

  const tagsArr = [...tags].map((tag, index) => {
    const tagArr = data.filter(item => item.tags === tag);
    return {
      tags: tag,
      key: index,
      children: tagArr,
    };
  });

  return tagsArr;
};

export const getSwaggerInfos = () => {
  const swaggerData = getLocalStorage('swagger-data');
  const parsed = JSON.parse(swaggerData) || {};
  // 特殊处理3.0也增加defintions

  // 如果是3.0特殊处理
  if(parsed.openapi) {
    parsed.definitions = parsed?.components?.schemas;
  }
  return parsed;
};

export const getCurrentPathInfo = (record = {}, paths = []) => {
  const { method = '', url = '' } = record;
  const currentPath = paths[url][method];
  return currentPath || {};
};

export const transformParams = (parameters = [], definitions) => {
  const hasSchema = parameters.some(item => item?.schema);
  if (!hasSchema) {
    return parameters;
  }
  const result =
    Array.isArray(parameters) &&
    parameters.map(item => {
      if (item.schema && item.schema['$ref']) {
        const schemaNameRef = item.schema['$ref'];
        const schemaName = schemaNameRef?.substring(
          schemaNameRef.lastIndexOf('/') + 1,
        );
        const curSchema = definitions[schemaName];

        if(!curSchema?.properties) {
          return;
        }

        const properties = Object.keys(curSchema?.properties)?.map(key => {
          const curProperties = curSchema.properties[key];
          // 如果他还是refs的情况，将他进行处理，并且如果是type 是array的情况，将他进行处理
          if(curProperties?.items?.originalRef && curProperties?.type === 'array') {
            const res = getSchema(curProperties?.items, definitions,);
            return {
              name: key,
              type: curProperties?.type,
              description: curProperties?.description,
              in: item.in,
              children: res,
            }
          }
          // 补充object 的情况
          if(curProperties?.originalRef) {
            const res = getSchema(curProperties, definitions);
            return {
              name: key,
              type: curProperties?.type || 'object',
              description: curProperties?.description,
              in: item.in,
              children: res,
            }
          }

          return {
            name: key,
            in: item.in,
            ...curProperties,
          };
        });
        return properties;
      }
      if(item?.schema?.properties) {
        const curSchema = item.schema;
        const properties = Object.keys(curSchema?.properties)?.map(key => {
          const curProperties = curSchema.properties[key];
          // 如果他还是refs的情况，将他进行处理，并且如果是type 是array的情况，将他进行处理
          if(curProperties?.items?.originalRef && curProperties?.type === 'array') {
            const res = getSchema(curProperties?.items, definitions);
            return {
              name: key,
              type: curProperties?.type,
              description: curProperties?.description,
              in: item.in,
              children: res,
            }
          }
          // 补充object 的情况
          if(curProperties?.originalRef) {
            const res = getSchema(curProperties, definitions);
            return {
              name: key,
              type: curProperties?.type || 'object',
              description: curProperties?.description,
              in: item.in,
              children: res,
            }
          }

          return {
            name: key,
            in: item.in,
            ...curProperties,
          };
        });
        return properties;
      }

      return item;
    });
  return Array.isArray(result) ? result.flat() : [];
};

export const getParams = (record, options) => {
  // 获取数据源
  const { paths = {}, definitions = {} } = getSwaggerInfos();
  const result = getCurrentPathInfo(record, paths)
  let { parameters = [] } = result;
  
  let moreRequestBody = [];
  let parameters2 = [];
  const schema = result?.requestBody?.content?.['application/json'];
  // 特殊处理3.0问题
  if(schema) {
    parameters2 = [schema]
  }
  
  // debugger
  const transFormedParams1 = transformParams(parameters, definitions);
  const transFormedParams2 = transformParams(parameters2, definitions);
  // console.log("🚀 ~ file: data.js:154 ~ getParams ~ transFormedParams2:", transFormedParams2)

  const allResultParams = transFormedParams1.concat(transFormedParams2);

  // 重新排序下，type 是array或者object的在最下方,有children部分的放在最下面
  allResultParams?.sort((a,b) => a.children ? 1 : -1)
  return allResultParams;
};

export const getResponse = (record, options) => {
  // 获取数据源
  const { paths = {}, definitions = {} } = getSwaggerInfos();
  const { responses = [] } = getCurrentPathInfo(record, paths);
  // debugger
  const transFormedParams = transformResponse(responses['200'], definitions);
  // alert(JSON.stringify(transFormedParams))
  return transFormedParams;
};

const flat = arr => {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flat(cur) : cur);
  }, []);
};

export const getSchema = (schema, definitions, processedRefs = new Set()) => {
  if (schema) {
    const schemaNameRef = schema['$ref'] || '';
    const schemaName = schemaNameRef?.substring(schemaNameRef.lastIndexOf('/') + 1);
    let curSchema = {};

    if (schemaName) {
      // 检查是否已经处理过该引用，防止无限递归
      if (processedRefs.has(schemaName)) {
        return [];
      }

      curSchema = definitions[schemaName];

      // 将当前引用标记为已处理
      processedRefs.add(schemaName);
    }

    // 特殊处理直接是schema的情况
    if (schema?.properties) {
      curSchema = schema;
    }

    const properties = Object.keys(curSchema?.properties || {}).filter(key => {
      const curProperties = curSchema.properties[key];
      // 废弃的直接删除
      return !curProperties.deprecated && !curProperties.writeOnly;
    }).map(key => {
      const curProperties = curSchema?.properties?.[key];

      if (curProperties?.items?.originalRef || curProperties?.items?.$ref) {
        // 递归调用getSchema，并传递已处理的引用集合
        const res = getSchema(curProperties?.items, definitions, processedRefs);
        return res;
      }

      return {
        name: key,
        ...curProperties,
      };
    }) || [];

    // 将已处理的引用集合还原为初始状态，以便在不同的分支中处理其他引用
    processedRefs.delete(schemaName);

    return flat(properties);
  }

  return [];
};

export const transformResponse = (obj, definitions) => {
  const schema = obj?.schema || obj?.content?.['*/*']?.schema || {};
  if (schema) {
    const schemaNameRef = schema['$ref'];
    const schemaName = schemaNameRef?.substring(
      schemaNameRef.lastIndexOf('/') + 1,
    );
    const curSchema = definitions[schemaName];

    let result = {};
    Object.keys(curSchema?.properties || {}).map(key => {
      const obj = curSchema?.properties[key];
      const schemaNameRef = obj['$ref'] || '';
      if (schemaNameRef) {
        result = obj;
      }
    });

    const dataProperties = result;

    const res = getSchema(dataProperties, definitions);
    return res;
  }
  return [];
};
