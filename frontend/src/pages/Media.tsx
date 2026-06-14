import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
export default function Media() {
  const { id } = useParams();
  const number = Number(id);
  if (number > 5) {
    return <NotFound />;
  }
  return <>media : {id}</>;
}
