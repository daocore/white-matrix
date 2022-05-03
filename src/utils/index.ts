import { FileItem } from "../store/fileReducer";

export const setFileItem = (files: FileItem[], path: (string | number)[], prop: string, val: any) => {
  const data = JSON.parse(JSON.stringify(files));
  path?.reduce((pr: any, next: any, i: number) => {
    const value = pr[next] || pr?.children[next] || pr;
    if (i === path?.length - 1) {
      if (pr[next] && prop) pr[next][prop] = val;
      else if (pr?.children[next] && prop) pr.children[next][prop] = val
    }
    return value
  }, data);

  return data
}

export const getFileItem = (files: FileItem[], path: (string | number)[], prop: string) => {
  const data = JSON.parse(JSON.stringify(files));
  const value = path?.reduce((pr: any, next: any) => pr[next] || pr?.children[next] || pr, data)
  return prop === "self" ? value : value[prop]
}

export const modifyID = function (obj: any) {
  let newobj: any = obj.constructor === Array ? [] : {};
  if (typeof obj === 'object') {
    for (let i in obj) {
      if (typeof obj[i] === 'object') {
        newobj[i] = modifyID(obj[i]);
      }else{
        newobj[i] = i === "id" ? createID() : obj[i];
      }
    }
  }
  return newobj;
};

//用于生成id
export const getID = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

export const createID = () => getID() + "-" + getID() + "-" + getID()