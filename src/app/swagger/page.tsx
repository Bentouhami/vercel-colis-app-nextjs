'use client';

import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

function SwaggerPage() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <SwaggerUI url="/api/swagger" />
    </div>
  );
}

export default SwaggerPage;
