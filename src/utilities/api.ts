import { useRef, useState } from "react";

type ApiParams<T, P> = {
  api: ({ ...props }: T) => Promise<P | null>;
  onSuccess?: ({ ...props }: Awaited<P> | null, { ...data }: T) => any;
  onFail?: (e: any, { ...data }: T) => any;
  fetcher?: () => Promise<any>;
  initial?: P | null;
};

export const useApi = <T, P>({
  api,
  onSuccess = () => {},
  onFail = () => {},
  fetcher,
  initial,
}: ApiParams<T, P>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(initial);
  const _reset = useRef<boolean>(true);

  const withoutReset = () => {
    _reset.current = false;

    return {
      process,
    };
  };

  const process = (...props: Parameters<typeof api>): Promise<void> =>
    new Promise(async (resolve, reject) => {
      if (_reset.current) {
        setData(null);
      }
      setIsLoading(true);
      try {
        const data = await api(...props);
        setData(data);
        if (fetcher) await fetcher();
        onSuccess(data, ...props);
      } catch (e) {
        setIsLoading(false);
        onFail(e, ...props);
        reject(e);
        return;
      }

      setIsLoading(false);
      resolve();
    });

  return {
    data,
    withoutReset,
    process,
    isLoading,
  };
};
