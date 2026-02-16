import { useParams, Navigate } from "react-router-dom";

const ShareRedirect = () => {
  const { uuid } = useParams<{ uuid: string }>();

  if (!uuid) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to={`/results/${uuid}`} replace />;
};

export default ShareRedirect;
