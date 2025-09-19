
import { Request, Response, Headers } from 'undici';

// Polyfill for Fetch API
if (!global.Request) {
  (global as any).Request = Request;
  (global as any).Response = Response;
  (global as any).Headers = Headers;
}

// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';