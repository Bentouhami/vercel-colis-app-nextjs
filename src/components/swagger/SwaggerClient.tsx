'use client';

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
});

interface SwaggerClientProps {
  url: string; // Change from spec to url
}

export default function SwaggerClient({ url }: SwaggerClientProps) {
  return <SwaggerUI url={url} />;
}