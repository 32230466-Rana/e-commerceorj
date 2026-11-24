import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
export default function NotFoundPage(){return <div className="container not-found"><span className="eyebrow">NOT FOUND</span><h1>404<span>.</span></h1><p>Looks like this page took a different route.</p><Link className="btn btn-primary" to="/"><ArrowLeft size={17}/> Back home</Link></div>}
