import React from "react";
import { useLocation } from "react-router";
import { useHistory } from "react-router-dom";

export function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export function useShowAlbum() {
  const history = useHistory();
  const query = useQuery();
  return (key, value) => {
    query.append(key, value);
    history.push({ search: query.toString() });
  };
}
