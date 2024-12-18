import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="error">
      Upsík Dupsík, stránka nebyla nalezena
      <Link to="/">Zpátky na hlavní stránku</Link>
    </div>
  );
}
