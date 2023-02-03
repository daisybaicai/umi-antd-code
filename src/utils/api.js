import {sliceApiUrl, urlTransform} from './utils'
/**
 * 生成api 配置
 * @param payload
 * @options
 * @checkParams 默认check， 如果不check，则走默认全部都生成相关params
 */
export const handleApi =  (payload, options, checkParams = true) => {
  const { url, methods = 'GET', params = [], description } = payload;

  const upperMethods = methods.toUpperCase();

  const functionName = urlTransform(url, options?.prefix);

  const hasparams = checkParams ? Array.isArray(params) && params.length > 0: true;


  let requestUrl = "`${HOST}";
  requestUrl+= sliceApiUrl(url, options?.prefixHost);
  requestUrl+="`";

  const code = `
    \n
    // ${description}
    export async function fetch${functionName}(${hasparams ? 'params': ''}, options) {
      return request(${requestUrl}, {
        method: '${upperMethods}',
        params: {
          ...params,
        },
        ...(options || {})
      });
    }
  `;

  return code;
}

/**
 * 生成api 配置
 * @param payload
 * @options
 * @checkParams 默认check， 如果不check，则走默认全部都生成相关params
 */
export const handleRequest =  (payload, options, checkParams = true, index) => {
    const { url, methods = 'GET', params = [], description } = payload;
  
    const upperMethods = methods.toUpperCase();
  
    const functionName = urlTransform(url, options?.prefix);
  
    const hasparams = checkParams ? Array.isArray(params) && params.length > 0: true;
  
    const DataName = url.split('/').reverse()[0] + 'Data';
    const setName = `set${DataName.charAt(0).toUpperCase()+ DataName.slice(1)}`

    let requestUrl = "`${HOST}";
    requestUrl+= sliceApiUrl(url, options?.prefixHost);
    requestUrl+="`";
  
    const code = `
      \n
      const [${DataName}, ${setName}] = useState({});
      // ${description}
      const get${functionName} = () => {
        fetch${functionName}().then(res => {
            if(res.code === 0) {
                ${setName}(res.data)
            }
        })
      }
    `;
  
    return code;
  }