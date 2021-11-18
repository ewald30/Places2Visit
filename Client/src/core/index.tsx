export const BASE_URL = 'localhost:3000';

export const getLogger: (tag: string) => (...args: any) => void =
    tag => (...args) => console.log(tag, ...args);

export const config = {
    headers: {
        'Content-Type': 'application/json'
    }
}

export const authConfig = (token? : string) => ({
  headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
  }
})

export interface ResponseProps<T> {
    data: T
}

const log = getLogger('api');

export function withLogs<T>(promise: Promise<ResponseProps<T>>, requestName: string) : Promise<T> {
    log(`${requestName} - started`)

    return promise
        .then(result => {
            log(`${requestName} - success!: ${result}`);
            return Promise.resolve(result.data);
        })
        .catch(err => {
            log(`${requestName} - failed!: ${err}`);
            return Promise.reject(err);
        })
}



