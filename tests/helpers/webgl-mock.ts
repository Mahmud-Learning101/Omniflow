import type { Page } from '@playwright/test';

/**
 * Injects a headless WebGL and WebGL2 context mock into the page.
 * Prevents 3D canvas and shader initialization crashes in headless CI/CD environments.
 */
export async function injectWebGLMock(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;

    function createMockWebGLContext(canvas: HTMLCanvasElement): Record<string, unknown> {
      const glState: Record<string, unknown> = {
        canvas,
        drawingBufferWidth: canvas.width || 800,
        drawingBufferHeight: canvas.height || 600,
        VERSION: 7938,
        SHADING_LANGUAGE_VERSION: 35724,
        VENDOR: 7936,
        RENDERER: 7937,
        MAX_TEXTURE_SIZE: 3379,
        MAX_CUBE_MAP_TEXTURE_SIZE: 34076,
        MAX_RENDERBUFFER_SIZE: 34024,
        MAX_VERTEX_ATTRIBS: 34921,
        MAX_COMBINED_TEXTURE_IMAGE_UNITS: 35661,
        MAX_TEXTURE_IMAGE_UNITS: 34930,
        MAX_VERTEX_TEXTURE_IMAGE_UNITS: 35660,
        VERTEX_SHADER: 35633,
        FRAGMENT_SHADER: 35632,
        COMPILE_STATUS: 35713,
        LINK_STATUS: 35714,
        COLOR_BUFFER_BIT: 16384,
        DEPTH_BUFFER_BIT: 256,
        STENCIL_BUFFER_BIT: 1024,
        ARRAY_BUFFER: 34962,
        ELEMENT_ARRAY_BUFFER: 34963,
        STATIC_DRAW: 35044,
        DYNAMIC_DRAW: 35048,
        FLOAT: 5126,
        TRIANGLES: 4,
        RGBA: 6408,
        UNSIGNED_BYTE: 5121,
        TEXTURE_2D: 3553,
      };

      const handler: ProxyHandler<Record<string, unknown>> = {
        get(target: Record<string, unknown>, prop: string | symbol) {
          if (typeof prop === 'string' && prop in target) return target[prop];

          if (prop === 'getContextAttributes') {
            return () => ({
              alpha: true,
              depth: true,
              stencil: true,
              antialias: true,
              premultipliedAlpha: true,
              preserveDrawingBuffer: false,
            });
          }

          if (prop === 'getSupportedExtensions') {
            return () => ['ANGLE_instanced_arrays', 'OES_vertex_array_object'];
          }

          if (prop === 'getShaderPrecisionFormat') {
            return () => ({ precision: 23, rangeMin: 127, rangeMax: 127 });
          }

          if (prop === 'getExtension') {
            return (name: string) => {
              if (name === 'WEBGL_lose_context') {
                return { loseContext: () => {}, restoreContext: () => {} };
              }
              return {};
            };
          }

          if (prop === 'getParameter') {
            return (param: number | unknown) => {
              if (param === 7938 || typeof param === 'function' || !param) return 'WebGL 2.0 (Mock Context)';
              if (param === 35724) return 'WebGL GLSL ES 3.00 (Mock GLSL)';
              if (param === 7936 || param === 7937) return 'WebKit';
              if (param === 3379 || param === 34076 || param === 34024) return 4096;
              if (param === 34921 || param === 35660 || param === 35661 || param === 34930) return 16;
              if (param === 36347 || param === 36349 || param === 36348) return 1024;
              return 1;
            };
          }

          if (prop === 'getShaderParameter') return () => true;
          if (prop === 'getProgramParameter') {
            return (_p: unknown, param: number) => (param === 35718 || param === 35721 ? 0 : true);
          }
          if (prop === 'getActiveUniform') return () => ({ name: 'u_mock', size: 1, type: 5126 });
          if (prop === 'getActiveAttrib') return () => ({ name: 'a_mock', size: 1, type: 5126 });

          if (prop === 'getShaderInfoLog' || prop === 'getProgramInfoLog') return () => '';
          if (prop === 'getAttribLocation') return () => 0;
          if (prop === 'getUniformLocation') return (_p: unknown, name: string) => ({ name });

          if (
            prop === 'createShader' ||
            prop === 'createProgram' ||
            prop === 'createBuffer' ||
            prop === 'createTexture' ||
            prop === 'createFramebuffer' ||
            prop === 'createRenderbuffer' ||
            prop === 'createVertexArray'
          ) {
            return () => ({ id: Math.random() });
          }

          if (typeof prop === 'string' && /^[A-Z0-9_]+$/.test(prop)) return 0;

          return () => {};
        },
      };

      return new Proxy(glState, handler);
    }

    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      contextType: string,
      options?: unknown
    ): unknown {
      if (
        contextType === 'webgl' ||
        contextType === 'experimental-webgl' ||
        contextType === 'webgl2'
      ) {
        return createMockWebGLContext(this);
      }
      return originalGetContext.call(this, contextType, options);
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
}
