import React from "react";
import { useLocation } from "react-router";
import { useHistory } from "react-router-dom";

export function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export function useShowAlbum() {
  const history = useHistory();
  let params = new URL(window.location).searchParams;
  return (key, value) => {
    params.append(key, value);
    history.push({ search: params.toString() });
  };
}
