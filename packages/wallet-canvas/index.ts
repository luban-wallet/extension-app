export default class WalletCanvas {
  static crypto: Crypto = globalThis.crypto
  static doc: Document = globalThis.document

  private lastTime: number = Date.now()
  private seedCount: number = 0
  public seedLimit: number = 360
  private positions: {x: number, y: number, c: string}[] = []

  private wrapper: HTMLElement | null = null
  private canvas: HTMLCanvasElement | null = null
  private context: CanvasRenderingContext2D | null = null
  public fillSize: number = 3
  public font: string = "15px 'Arial'"
  public textBaseline: CanvasTextBaseline = 'alphabetic'

  public onFinish: (() => void) | null = null

  public async toEntropy(entropyLength: number): Promise<Uint8Array | null> {
    if(this.canvas === null) {
      return null
    }

    if(entropyLength % 32 !== 0) {
      throw new Error('entropyLength must be a multiple of 32')
    }

    let base64 = this.canvas.toDataURL()
    let u8 = new TextEncoder().encode(base64)
    let hashBuffer = await WalletCanvas.crypto.subtle.digest('SHA-256', u8)
    let total = Array.from(new Uint8Array(hashBuffer))

    let final = new Uint8Array(entropyLength / 8)
    for(let i=0; i<final.length; i++) {
      final[i] = total[i]
    }

    return final
  }

  public randomBytes(length: number) {
    let ua = new Uint8Array(length)
    WalletCanvas.crypto.getRandomValues(ua)
    return ua
  }

  public randomColor() {
    const r = Math.floor(Math.random() * 255).toString(16).padStart(2, '0')
    const g = Math.floor(Math.random() * 255).toString(16).padStart(2, '0')
    const b = Math.floor(Math.random() * 255).toString(16).padStart(2, '0')
    // const a = Math.random().toFixed(2)
    return `#${r}${g}${b}`
  }

  public init(wrapperId: string) {
    this.initDom(wrapperId)
    this.initEvent()
  }

  private initDom(wrapperId: string) {
    this.wrapper = WalletCanvas.doc.getElementById(wrapperId)!

    this.canvas = WalletCanvas.doc.createElement('canvas')
    this.canvas.setAttribute('width', this.wrapper.clientWidth.toString())
    this.canvas.setAttribute('height', this.wrapper.clientHeight.toString())

    this.context = this.canvas.getContext('2d')!
    this.context.font = this.font
    this.context.textBaseline = this.textBaseline

    this.wrapper.appendChild(this.canvas)
  }

  private initEvent() {
    if(this.canvas === null) {
      return
    }
    this.canvas.onmousemove = (e) => {
      this.draw(e)
    }
  }

  private draw(e: any) {
    if(this.canvas === null || this.context === null) {
      return
    }

    if(this.seedCount > this.seedLimit) {
      return
    }

    if(this.seedCount === this.seedLimit) {
      this.seedCount++
      this.seedDone()
      return
    }

    let now = Date.now()
    if(now - this.lastTime > 50) {
      this.positions.push({
        x: e.offsetX,
        y: e.offsetY,
        c: this.randomColor()
      })

      this.seedCount++

      let timeText = '<TimeStamp>: ' + Date.now().toString()
      let progressText = '<Progress>: ' + Math.round((this.seedCount / this.seedLimit) * 100) + '%'

      // draw text
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.context.fillStyle = this.randomColor()
      this.context.fillText(timeText, 10, 20)
      this.context.fillStyle = this.randomColor()
      this.context.fillText(progressText, 10, 40)

      // draw dots
      for(let i=0; i<this.positions.length; i++) {
        this.context.fillStyle = this.positions[i].c
        this.context.fillRect(this.positions[i].x, this.positions[i].y, this.fillSize, this.fillSize)
      }
      this.lastTime = Date.now()
    }
  }

  private async seedDone() {
    if(!this.canvas || this.onFinish === null) {
      return
    }

    this.onFinish()
  }

  public clear() {
    if(this.canvas === null || this.context === null) {
      return
    }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.seedCount = 0
    this.positions = []
  }

  public destroy() {
    if(this.canvas === null || this.context === null) {
      return
    }

    this.canvas.onmousemove = null
    this.wrapper?.removeChild(this.canvas)
    this.context = null
    this.canvas = null
    this.wrapper = null

    this.positions = []
  }
}
