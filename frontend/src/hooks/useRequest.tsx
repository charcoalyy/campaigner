import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useEffect, useState } from "react";

interface useRequestProps {
  request: (givenParams: { params?: any } | any) => Promise<any>;
  requestByDefault: boolean;
  params?: any;
}

const useRequest = ({ request, requestByDefault, params }: useRequestProps) => {
  const [data, setData] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(requestByDefault);
  const { getAccessTokenSilently } = useAuth0();

  // provides a re-usable call to the desired request
  const makeRequest = useCallback(
    async (params?: any) => {
      setLoading(true);
      let response = undefined;

      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://dev-2atjq86z1xxiu1u6.us.auth0.com/api/v2/`,
          scope: "read:current_user",
        },
      });

      console.log(token);

      try {
        response = await request(params ? { params: params } : {});
        setData(response);
      } catch (err: any) {
        setData(undefined);
        console.log("Error: ", err);
      }
      setLoading(false);
      return response;
    },
    [request]
  );

  // automatically calls desired request if default is true
  useEffect(() => {
    if (loading && requestByDefault) {
      makeRequest(params);
    }
  }, [loading, requestByDefault, makeRequest, params]);

  return { data, loading, makeRequest };
};

export default useRequest;
