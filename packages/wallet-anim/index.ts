/**
 * https://www.shadertoy.com/view/3csSWB
 */
export default class Anim {
  animationTime: number = 0
  time = Date.now()
  totalTimeSec = 0
  gl: WebGL2RenderingContext | null = null
  program: WebGLProgram | null = null

  getVShader() {
    const str = `#version 300 es
in vec2 a_Position;
uniform vec3 iResolution;
uniform bool iTheme;

void main() {
  gl_Position = vec4(a_Position.xy, 0.0 , 1.0);
}`;
    return str
  }

  getFShader = () => {
    const str =`#version 300 es
precision mediump float;
out vec4 fragColor;

// shadertoy parameters
uniform vec3 iResolution;
uniform float iTime;
uniform bool iTheme;

void mainImage(out vec4 O, vec2 F) {
  // Iterator and attenuation (distance-squared)
  float i = .2, a;
  // Resolution for scaling and centering
  vec2 r = iResolution.xy,
    // Centered ratio-corrected coordinates
    p = ( F + F - r ) / r.y / 0.8,
    // Diagonal vector for skewing
    d = vec2(-0.5, 1.5),
    // Blackhole center
    b = p - i * d,
    // Rotate and apply perspective
    c = p * mat2(1, 1, d / (.1 + i / dot(b, b))),
    // Rotate into spiraling coordinates
    v = c * mat2(cos(.5 * log(a=dot(c, c)) + iTime * i + vec4(0, 33, 11, 0))) / i,
    // Waves cumulative total for coloring
    w;

  // Loop through waves
  for(; i++<9.; w += 1.+sin(v) )
    // Distort coordinates
    v += .8 * sin(v.yx * i + iTime) / i + .5;

  // Acretion disk radius
  i = length( sin(v / .3) * .2 + c * (2. + d) );
  // Red/blue gradient
  O = 1. - exp( -exp( c.x * vec4(1.2, -0.8, -1.4, 0.0) )
    // Wave coloring
    / w.xyyx
    // Acretion disk brightness
    / ( 2. + i*i/4. - i )
    // Center darkness
    / ( .4 + 0.8 / a )
    // Rim highlight
    / ( .01 + abs( length(p) - .8 ) )
  );

  if(iTheme) {
    O = vec4(1.0 - O.r, 1.0 - O.g, 1.0 - O.b, 1.0);
  }
}

void main() {
    vec4 col = vec4(0.0, 0.0, 0.0, 1.0);
    mainImage(col, gl_FragCoord.xy);
    fragColor = col;
}`;

    return str
  }

  createShader(gl: WebGL2RenderingContext, type: number, source: string) {
    const s = gl.createShader(type) as WebGLShader
    gl.shaderSource(s, source)
    gl.compileShader(s)
    if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error('An error occurred compiling v shaders: ' + gl.getShaderInfoLog(s))
    }

    return s
  }

  createProgram(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader) {
    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.useProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program))
    }

    return program
  }

  initCanvas(id: string, light: number) {
    const canvas = document.getElementById(id) as HTMLCanvasElement
    // canvas.width = globalThis.innerWidth
    // canvas.height = globalThis.innerWidth

    this.gl = canvas.getContext('webgl2', { alpha: true })
    if(this.gl === null) {
      throw new Error("WebGL2 is not supported in your browser")
    }

    const vs = this.createShader(this.gl, this.gl.VERTEX_SHADER, this.getVShader())
    const fs = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, this.getFShader())
    this.program = this.createProgram(this.gl, vs, fs)

    const posArr = [0, 3, 2, -1, -2, -1]
    const glPosBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, glPosBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(posArr), this.gl.STATIC_DRAW)
    const aPositionAddr = this.gl.getAttribLocation(this.program, "a_Position")
    this.gl.vertexAttribPointer(aPositionAddr, 2, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(aPositionAddr)

    const iResolutionAddr = this.gl.getUniformLocation(this.program, "iResolution")
    this.gl.uniform3f(iResolutionAddr, this.gl.canvas.width, this.gl.canvas.height, 1)

    const iTheme = this.gl.getUniformLocation(this.program, "iTheme")
    this.gl.uniform1i(iTheme, light)

    this.gl.clearColor(0.0, 0.0, 0.0, 0.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    this.loop()
  }

  loop() {
    if(this.gl === null || this.program === null) {
        return
    }

    const nowTime = Date.now()
    const dt = (nowTime - this.time) * 0.001
    this.totalTimeSec += dt
    this.time = nowTime

    const iTimeAddr = this.gl.getUniformLocation(this.program, "iTime")
    this.gl.uniform1f(iTimeAddr, this.totalTimeSec)

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3)
    this.animationTime = requestAnimationFrame(() => {
      this.loop()
    })
  }

  stop() {
    cancelAnimationFrame(this.animationTime)
  }
}
